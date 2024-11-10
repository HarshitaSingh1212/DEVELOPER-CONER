const { 
   Given,
   When,
   Then, 
   BeforeAll, 
   Before, 
   After, 
   AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();
const CustomError = require('../../utilities/custom-error');

const buildSignUpTenant = require('./signup.js');

const mockData = {
  generateEmployeeId: () => {},
  insertDataIntoTableTenats: () => {},
  hashedPassword: () => {},
  signUpData: () => {},
  insertDataIntoTableEmployees: () => {},
  insertIntoChannelTable: () => {},
  generateToken: () => {}
};

let generateEmployeeIdStub;
let insertDataIntoTableTenatsStub;
let hashedPasswordStub;
let signUpDataStub;
let insertDataIntoTableEmployeesStub;
let insertIntoChannelTableStub;
let generateTokenStub;

BeforeAll(() => {
  generateEmployeeIdStub = sandBox.stub(mockData, "generateEmployeeId");
  insertDataIntoTableTenatsStub = sandBox.stub(mockData, "insertDataIntoTableTenats");
  hashedPasswordStub = sandBox.stub(mockData, "hashedPassword");
  signUpDataStub = sandBox.stub(mockData, "signUpData");
  insertDataIntoTableEmployeesStub = sandBox.stub(mockData, "insertDataIntoTableEmployees");
  insertIntoChannelTableStub = sandBox.stub(mockData, "insertIntoChannelTable");
  generateTokenStub = sandBox.stub(mockData, "generateToken");
});

Before(() => {
  generateEmployeeIdStub.callsFake(async (arg) => {
    console.log("token generated");
  });
  insertDataIntoTableTenatsStub.callsFake(async (args) => {
    expect(args).to.have.own.property("tenant_name");
  });
  hashedPasswordStub.callsFake(async (args) => {
    console.log("password is hashed");
  });
  signUpDataStub.callsFake(async (args) => {
    expect(args).to.have.own.property("employee_email");
    if (args.employee_email === "abc") {
      return new CustomError(400,"email format is invalid");
    }
  });
  insertDataIntoTableEmployeesStub.callsFake(async (args) => {
    expect(args).to.have.own.property("employee_email");
    expect(args).to.have.own.property("employee_name");
    expect(args).to.have.own.property("employee_password");
  });
  insertIntoChannelTableStub.callsFake(async (args) => {
    console.log("inserted default channel in channel table")
  });
  generateTokenStub.callsFake(async (args) => {
   console.log("token generated");
  });
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});
Given('the minimalism', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'success';
});

Given("employee_email: {string}, employee_password: {string}, employee_name: {string}, tenant_name: {string} sign-up", async (employee_email, employee_password, employee_name, tenant_name) => {
  this.employee_email = employee_email;
  this.employee_password = employee_password;
  this.employee_name = employee_name;
  this.tenant_name = tenant_name;
});

When("try to sign up", async () => {
  const signUpTenant = buildSignUpTenant({
    generateEmployeeId: mockData.generateEmployeeId,
    signUpData: mockData.signUpData,
    insertDataIntoTableTenats: mockData.insertDataIntoTableTenats,
    hashedPassword: mockData.hashedPassword,
    insertDataIntoTableEmployees: mockData.insertDataIntoTableEmployees,
    insertIntoChannelTable: mockData.insertIntoChannelTable,
    generateToken: mockData.generateToken,
    CustomError
  });

  try {
    await signUpTenant({
      employee_email: this.employee_email,
      employee_password: this.employee_password,
      tenant_name: this.tenant_name,
      employee_name: this.employee_name
    });
    this.result = "Tenant signed up successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for sign up",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for sign up",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
