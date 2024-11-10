const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildCreateTenantProduct = require('./create-product.js');
const CustomError = require("../../utilities/custom-error.js");

const mockData = {
  verifyToken: () => true,
  findPermission: () => {},
  productData: () => {},
  insertInProductTable: () => {},
  findMaxProductId: () => {},
  generateUrl: () => {},
  insertIntoProductTranslationTable:  () => {}
};

let verifyTokenStub;
let findPermissionStub;
let productDataStub;
let insertInProductTableStub;
let findMaxProductIdStub;
let generateUrlStub;
let insertIntoProductTranslationTableStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  productDataStub = sandBox.stub(mockData, "productData");
  insertInProductTableStub = sandBox.stub(mockData, "insertInProductTable");
  findMaxProductIdStub = sandBox.stub(mockData, "findMaxProductId");
  generateUrlStub = sandBox.stub(mockData, "generateUrl");
  insertIntoProductTranslationTableStub = sandBox.stub(mockData, "insertIntoProductTranslationTable");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
    console.log(args)
    if(args.employee_id == '4'){
        return false;
    }

    return true;
  })
  findPermissionStub.callsFake(async () => {});
  productDataStub.callsFake(async (args) => {
    if(!args.price)
        throw new CustomError(400, "price is required field");

    if(!args.product_name)
        throw new CustomError(400, "product name is required field");

    if(!args.product_type)
        throw new CustomError(400, "product type is required field");
  });
  insertInProductTableStub.callsFake(async () => {});
  findMaxProductIdStub.callsFake(async () => {});
  generateUrlStub.callsFake(async () => {});
  insertIntoProductTranslationTableStub.callsFake(async () => {});
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("employee_id: {string} price: {string} product_name: {string} product_type: {string} product_description: {string}", (employee_id,price,product_name,product_type,product_description) => {
    this.employee_id = employee_id,
    this.price = price,
    this.product_name = product_name
    this.product_type = product_type,
    this.product_description = product_description
});

When("try to create product", async () => {
  const createTenantProduct = buildCreateTenantProduct({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    productData: mockData.productData,
    insertInProductTable: mockData.insertInProductTable,
    findMaxProductId: mockData.findMaxProductId,
    generateUrl: mockData.generateUrl,
    insertIntoProductTranslationTable: mockData.insertIntoProductTranslationTable,
    CustomError
  });

  try {
    await createTenantProduct({
        employee_id: this.employee_id,
        price:this.price,
        product_name:this.product_name,
        product_type: this.product_type,
        product_description: this.product_description
});
    this.result = "product created successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then("product created result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("product creation error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
