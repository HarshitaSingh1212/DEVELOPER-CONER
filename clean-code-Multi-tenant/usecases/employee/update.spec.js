const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildUpdateEmployeeById = require('./update.js');
const CustomError = require("../../utilities/custom-error.js");
const { employee_email } = require("./login.spec.js");

const mockData = {
  verifyToken: () => {},
  findPermission: () => {},
  updateEmployeeFields: () => {}
};

let verifyTokenStub;
let findPermissionStub;
let updateEmployeeFieldsStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  updateEmployeeFieldsStub = sandBox.stub(mockData, "updateEmployeeFields");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
    return true;
  });
  findPermissionStub.callsFake(async () => {});
  updateEmployeeFieldsStub.callsFake(async (args) => {
    if(!args.employee_id)
        throw new CustomError(400,"employee Id is required")
    if(args.employee_id == 7812)
        throw new CustomError(404,"employee Id not found")
  });
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("update employee_name: {string} where employee_id: {string}", async (employee_name, employee_id) => {
    this.employee_name = employee_name;
    this.employee_id = employee_id;
});

When("try to update employee by id", async () => {
  const updateEmployeeById = buildUpdateEmployeeById({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    updateEmployeeFields: mockData.updateEmployeeFields,
    CustomError
  });

  try {
    await updateEmployeeById({
        employee_email: this.employee_email,
       employee_id: this.employee_id 
    });
    this.result = "updated successfull";
  } catch (error) {
    this.error = error.message;
  }
});

Then("It should update the employee fields with result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("updation error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});



