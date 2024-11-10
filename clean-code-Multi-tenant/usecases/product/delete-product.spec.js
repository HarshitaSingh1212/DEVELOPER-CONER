const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildDeleteTenantProduct = require('./delete-product.js');
const CustomError = require("../../utilities/custom-error.js");

const mockData = {
  verifyToken: () => true,
  findPermission: () => {},
  deleteProductData: () => {},
  deleteInProductTable: () => {}
};

let verifyTokenStub;
let findPermissionStub;
let deleteProductDataStub;
let deleteInProductTableStub;


BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  deleteProductDataStub = sandBox.stub(mockData, "deleteProductData");
  deleteInProductTableStub = sandBox.stub(mockData, "deleteInProductTable");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
    return true;
  })
  findPermissionStub.callsFake(async () => {});
  deleteProductDataStub.callsFake(async (args) => {
    if(!args.product_id)
        throw new CustomError(400, "product Id is required");

  });
  deleteInProductTableStub.callsFake(async (args) => {
    if(args.param.productId == '3')
        throw new CustomError(400, "product not found");
  });
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("product_id: {string}", (product_id) => {
    this.product_id = product_id
});

When("try to delete product", async () => {
  const deleteTenantProduct = buildDeleteTenantProduct({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    deleteProductData: mockData.deleteProductData,
    deleteInProductTable: mockData.deleteInProductTable,
    CustomError
  });

  try {
    await deleteTenantProduct({
        param:{productId: this.product_id}
});
    this.result = "product deleted successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then("product deleted result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("product deleting error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
