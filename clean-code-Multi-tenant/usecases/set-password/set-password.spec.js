const { Given, When, Then, BeforeAll, Before, After } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const buildSetPasswordOfEmployee = require('./set-password.js');
const CustomError = require("../../utilities/custom-error.js");

const mockData = {
  verifyToken: () => {},
  hashedPassword: () => {},
  insertPasswordIntoEmployees: () => {}
};

let verifyTokenStub;
let hashedPasswordStub;
let insertPasswordIntoEmployeesStub;
let setPasswordOfEmployee;

BeforeAll(() => {
  verifyTokenStub = sinon.stub(mockData, "verifyToken");
  hashedPasswordStub = sinon.stub(mockData, "hashedPassword");
  insertPasswordIntoEmployeesStub = sinon.stub(mockData, "insertPasswordIntoEmployees");

});

Before(() => {
  
  verifyTokenStub.callsFake(async (agrs) => {
    return true; 
  });

  hashedPasswordStub.callsFake(async (args) => { 
    if (!args.employee_password) 
        throw new CustomError(400,"password is required") 
  });

  insertPasswordIntoEmployeesStub.callsFake(async (args) => {
  });
});

Given('set password employee_password: {string}', (employee_password) => {
    this.employee_password = employee_password
});

When('try to set password', async () => {
  setPasswordOfEmployee = buildSetPasswordOfEmployee({
    verifyToken: verifyTokenStub,
    hashedPassword: hashedPasswordStub,
    insertPasswordIntoEmployees: insertPasswordIntoEmployeesStub,
    CustomError
  });

  try {
    await setPasswordOfEmployee({employee_password: this.employee_password});
    this.result = "password set successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then('show the set password result: {string}', (result) => {
  expect(this.error).to.be.undefined;
  expect(this.result).to.be.equal(result);
});

Then('set error: {string}', (error) => {
  expect(this.error).to.be.equal(error);
});

After(() => {
  sinon.restore(); 
});
