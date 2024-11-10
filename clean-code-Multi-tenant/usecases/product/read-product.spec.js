const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildReadTenantProduct = require('./read-product.js');
const CustomError = require("../../utilities/custom-error.js");

const mockData = {
  verifyToken: () => true,
  findPermission: () => {},
  fetchProduct: () => {}
};

let verifyTokenStub;
let findPermissionStub;
let fetchProductStub;



BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  fetchProductStub = sandBox.stub(mockData, "fetchProduct");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
    if(!args.employee_id)
      return false;
    return true;
  })
  findPermissionStub.callsFake(async () => {});
  fetchProductStub.callsFake(async (args) => {
    if(args.param.productId == '111')
        throw new CustomError(404,"product not found")
    return "list of product";
  });
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("employee_id: {string} and product_id: {string}", (employee_id,product_id) => {
    this.employee_id = employee_id,
    this.product_id = product_id
});

When("try to read product by ID", async () => {
  const readTenantProduct = buildReadTenantProduct({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    fetchProduct: mockData.fetchProduct,
    CustomError
  });

  try {
    const result = await readTenantProduct({
        employee_id: this.employee_id,
       param:{productId: this.product_id}
});
    this.result = result;
  } catch (error) {
    this.error = error.message;
  }
});

Then("product read by id result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("product reading by id error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});