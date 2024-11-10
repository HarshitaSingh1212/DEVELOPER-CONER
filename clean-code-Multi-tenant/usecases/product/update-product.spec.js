const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildUpdateTenantProduct = require('./update-product.js');
const CustomError = require("../../utilities/custom-error.js");

const mockData = {
  verifyToken: () => true,
  findPermission: () => {},
  updateProductData: () => {},
  updateInProductTable: () => {},
  updateInProductTranslationTable: () => {}
};

let verifyTokenStub;
let findPermissionStub;
let updateProductDataStub;
let updateInProductTableStub;
let updateInProductTranslationTableStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  updateProductDataStub = sandBox.stub(mockData, "updateProductData");
  updateInProductTableStub = sandBox.stub(mockData, "updateInProductTable");
  updateInProductTranslationTableStub = sandBox.stub(mockData, "updateInProductTranslationTable");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
    return true;
  });

  findPermissionStub.callsFake(async () => {});

  updateProductDataStub.callsFake(async (args) => {
    if (!args.product_id || args.product_id === '3') {
      throw new CustomError(404, "product not found");
    }
  });

  updateInProductTableStub.callsFake(async (args) => {
  
  });

  updateInProductTranslationTableStub.callsFake(async (args) => {

  });
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("update product_id: {string} price: {string} product_name: {string} product_type: {string} product_description: {string}", 
  (product_id, price, product_name, product_type, product_description) => {
    this.product_id = product_id;
    this.price = price;
    this.product_name = product_name;
    this.product_type = product_type;
    this.product_description = product_description;
});

When("try to update product", async () => {
  const updateTenantProduct = buildUpdateTenantProduct({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    updateProductData: mockData.updateProductData,
    updateInProductTable: mockData.updateInProductTable,
    updateInProductTranslationTable: mockData.updateInProductTranslationTable,
    CustomError
  });

  try {
    const result = await updateTenantProduct({
      product_id: this.product_id,
      price: this.price,
      product_name: this.product_name,
      product_type: this.product_type,
      product_description: this.product_description
    });

    this.result = "product updated successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then("It should update product data and show result: {string}", async (result) => {
  expect(this.error).to.be.undefined;
  expect(this.result).to.be.equal(result);
});

Then("product updation error: {string}", async (error) => {
  expect(this.error).to.be.equal(error);
});
