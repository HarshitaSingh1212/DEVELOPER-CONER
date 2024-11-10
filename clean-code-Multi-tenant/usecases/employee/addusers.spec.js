const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildAddUsersAsEmployee = require('./addusers.js');
const CustomError = require("../../utilities/custom-error.js");

const mockData = {
  verifyToken: () => true, // or false for invalid token
  findPermission: () => {},
  generateEmployeeId: () => {},
  generateTokenForAddingUser: () => {},
  addUserData: () => {},
  insertDataIntoTableEmployees: () => {},
  sendEmail: () => {}
};

let verifyTokenStub;
let findPermissionStub;
let generateEmployeeIdStub;
let generateTokenForAddingUserStub;
let addUserDataStub;
let insertDataIntoTableEmployeesStub;
let sendEmailStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  generateEmployeeIdStub = sandBox.stub(mockData, "generateEmployeeId");
  generateTokenForAddingUserStub = sandBox.stub(mockData, "generateTokenForAddingUser");
  addUserDataStub = sandBox.stub(mockData, "addUserData");
  insertDataIntoTableEmployeesStub = sandBox.stub(mockData, "insertDataIntoTableEmployees");
  sendEmailStub = sandBox.stub(mockData, "sendEmail");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
    return true;
  });
  findPermissionStub.callsFake(async (args) => {});
  generateEmployeeIdStub.callsFake(async () => {});
  generateTokenForAddingUserStub.callsFake(async () => {});
  addUserDataStub.callsFake(async (args) => {
    if(args.employee_email == 'existing@example.com')
        throw new CustomError(400,"user already exist")
  });
  insertDataIntoTableEmployeesStub.callsFake(async () => {});
  sendEmailStub.callsFake(async () => {});
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("employee_email: {string} employee_name: {string}", async (employee_email,employee_name) => {
  this.employee_email = employee_email,
  this.employee_name = employee_name
});

When("try to add user as employee", async () => {
  const addUsersAsEmployee = buildAddUsersAsEmployee({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    generateEmployeeId: mockData.generateEmployeeId,
    generateTokenForAddingUser: mockData.generateTokenForAddingUser,
    addUserData: mockData.addUserData,
    insertDataIntoTableEmployees: mockData.insertDataIntoTableEmployees,
    sendEmail: mockData.sendEmail,
    CustomError
  });

  try {
    await addUsersAsEmployee({
    employee_email:this.employee_email,
    employee_name: this.employee_name
  });
this.result = "employee added successfull";
  } catch (error) {
    this.error = error.message;
  }
});

Then("employee added result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("error in adding user error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
