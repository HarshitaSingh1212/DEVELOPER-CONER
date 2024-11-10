const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildDeleteEmployeeById = require('./delete.js');
const CustomError = require("../../utilities/custom-error.js");

const mockData = {
  verifyToken: () => true, // or false for invalid token
  findPermission: () => {},
  deleteEmployeeInEmployees: () => {}
};

let verifyTokenStub;
let findPermissionStub;
let deleteEmployeeInEmployeesStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  deleteEmployeeInEmployeesStub = sandBox.stub(mockData, "deleteEmployeeInEmployees");
});

Before(() => {
    verifyTokenStub.callsFake(async (args) => {
        return true;
      });
  findPermissionStub.callsFake(async (args) => {
    if(args.employee_id == 123)
         throw new CustomError(400, "permission denied for this operation")
  });
  deleteEmployeeInEmployeesStub.callsFake(async (args) => {
    if(args.employee_id == 122){
        throw new CustomError(404, "employee Id not found")
    }
});
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("a valid employee_id: {string}", async (employee_id) => {
    this.employee_id = employee_id;
    });
  
When("try to delete employee", async () => {
  const deleteEmployeeById = buildDeleteEmployeeById({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    deleteEmployeeInEmployees: mockData.deleteEmployeeInEmployees,
    CustomError
  });

  try {
    await deleteEmployeeById({employee_id:this.employee_id});
    this.result = "employee deleted successfull";
  } catch (error) {
    this.error = error.message;
  }
});

Then("It should delete the employee and show the result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("It should throw deleting error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
