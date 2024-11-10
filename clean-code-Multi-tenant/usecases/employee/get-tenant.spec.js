const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();
const CustomError = require('../../utilities/custom-error');

const buildGetTenantEmployeePassword = require('./get-tenant.js');

const mockData = {
  verifyToken: () => true, // or false for invalid token
  loginTenantId: () => {},
  generateToken: () => {}
};

let verifyTokenStub;
let loginTenantIdStub;
let generateTokenStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  loginTenantIdStub = sandBox.stub(mockData, "loginTenantId");
  generateTokenStub = sandBox.stub(mockData, "generateToken");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
    console.log("token verified");
  });
  loginTenantIdStub.callsFake(async (args) => {
    console.log(args, " args")
    if(args.tenant_id == 3) 
        throw new CustomError(404,"tenant ID not found")
  });
  generateTokenStub.callsFake(async () => {
    return;
  });
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("a valid tenant_id: {string}", async (tenant_id) => {
    this.tenant_id = tenant_id;
  });
  
When("try to get the tenant employee password with tenant_id", async () => {
  const getTenantEmployeePassword = buildGetTenantEmployeePassword({
    verifyToken: mockData.verifyToken,
    loginTenantId: mockData.loginTenantId,
    generateToken: mockData.generateToken,
    CustomError
  });

  try {
    await getTenantEmployeePassword({tenant_id: this.tenant_id});
    this.result = "enter password for the given tenant_id";
  } catch (error) {
    this.error = error.message;
  }
});

Then("It should return result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("It should return the error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
