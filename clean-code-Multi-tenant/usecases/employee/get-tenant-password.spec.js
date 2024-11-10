const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();
const CustomError = require('../../utilities/custom-error');

const buildGetEmployeePassword = require('./get-tenant-password.js');

const mockData = {
  verifyToken: () => true, // or false for invalid token
  checkCredentials: () => {},
  generateToken: () => {}
};

let verifyTokenStub;
let checkCredentialsStub;
let generateTokenStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  checkCredentialsStub = sandBox.stub(mockData, "checkCredentials");
  generateTokenStub = sandBox.stub(mockData, "generateToken");
});

Before(() => {
    verifyTokenStub.callsFake(async (args) => {
        return true;
      });
  checkCredentialsStub.callsFake(async (args) => {
  if(args.employee_password == 'ab')
     throw new CustomError(400,"invalid email or password");
  
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

Given('a valid employee_password: {string}', async (employee_password) => {
this.employee_password = employee_password;
});

When("validate employee password", async () => {
  const getEmployeePassword = buildGetEmployeePassword({
    verifyToken: mockData.verifyToken,
    checkCredentials: mockData.checkCredentials,
    generateToken: mockData.generateToken,
    CustomError
  });

  try {
    await getEmployeePassword({employee_password:this.employee_password});
    this.result = "welcome! login is successfull";
  } catch (error) {
    this.error = error.message;
  }
});

Then("It should generate login result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("It should throw the error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
