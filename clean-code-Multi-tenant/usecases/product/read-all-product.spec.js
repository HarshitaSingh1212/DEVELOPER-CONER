const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildReadAllTenantProduct = require('./read-all-product.js');
const CustomError = require("../../utilities/custom-error.js");

const mockData = {
  verifyToken: () => true,
  findPermission: () => {},
  fetchAllProduct: () => {}
};

let verifyTokenStub;
let findPermissionStub;
let fetchAllProductStub;



BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  fetchAllProductStub = sandBox.stub(mockData, "fetchAllProduct");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
    if(!args.employee_id)
      return false;
    return true;
  })
  findPermissionStub.callsFake(async () => {});
  fetchAllProductStub.callsFake(async (args) => {
    return "list of product";
  });
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("reader employee_id: {string}", (employee_id) => {
    this.employee_id = employee_id
});

When("try to read all product", async () => {
  const readAllTenantProduct = buildReadAllTenantProduct({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    fetchAllProduct: mockData.fetchAllProduct,
    CustomError
  });

  try {
    const result = await readAllTenantProduct({
        employee_id: this.employee_id
});
    this.result = result;
  } catch (error) {
    this.error = error.message;
  }
});

Then("product read all result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("all product reading error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
