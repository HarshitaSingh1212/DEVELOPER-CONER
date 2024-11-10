const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildLoginEmployee = require('./login.js');
const CustomError = require('../../utilities/custom-error');

const mockData = {
  generateToken: () => { },
  loginEmail: () => { },
  getTenantList: () => { }
};

let generateTokenStub;
let loginEmailStub;
let getTenantListStub;

BeforeAll(() => {
  generateTokenStub = sandBox.stub(mockData, "generateToken");
  loginEmailStub = sandBox.stub(mockData, "loginEmail");
  getTenantListStub = sandBox.stub(mockData, "getTenantList");
});

Before(() => {
  generateTokenStub.callsFake(async (args) => {
    console.log("token generated");
  });
  loginEmailStub.callsFake(async (args) => {
    expect(args).to.have.own.property("employee_email");
    if (args.employee_email == "invalid@example.com" || args.employee_email == "nonexisting@example.com")
      throw new CustomError(400, "invalid email");
  });
  getTenantListStub.callsFake(async (args) => {
 
    if (args.employee_email == 'ross@example.com') return "tenant_id :1";
    if (args.employee_email == "monica@example.com") return "tenant_id :1";
    
  });
});

After(() => {
  sandBox.resetHistory();
  this.employee_email = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("employee_email: {string} login", async (employee_email) => {
  this.employee_email = employee_email;
});

When("try to login", async () => {
  const loginEmployee = buildLoginEmployee({
    generateToken: mockData.generateToken,
    loginEmail: mockData.loginEmail,
    getTenantList: mockData.getTenantList,
    CustomError
  });

  try {
    const result = await loginEmployee({
      employee_email: this.employee_email
    });
    this.result = result.result;
  } catch (error) {
    this.error = error.message;
  }
});

Then("It should successfully login result: {string}",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  });

Then(
  "It should return the error: {string} for login",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);