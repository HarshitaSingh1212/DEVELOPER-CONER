const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildReadAllTenantChannel = require('./read-all-channel.js');
const { CustomError } = require("../set-password/index.js");

const mockData = {
  verifyToken: () => true, // or false for invalid token
  findPermission: () => {},
  readChannelFromTable: () => ["channel1", "channel2"] // mock data for channel list
};

let verifyTokenStub;
let findPermissionStub;
let readChannelFromTableStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  readChannelFromTableStub = sandBox.stub(mockData, "readChannelFromTable");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
    console.log(args)
   if(!args.tenant_id){
    return false;
   }
     return true;
  });
  findPermissionStub.callsFake(async () => {});
  readChannelFromTableStub.callsFake(async () => {
  });
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("read channel tenant_id: {string}", async (tenant_id) => {
  this.tenant_id=tenant_id;
});

When("try to read all channels", async () => {
  const readAllTenantChannel = buildReadAllTenantChannel({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    readChannelFromTable: mockData.readChannelFromTable,
    CustomError
  });

  try {
    mockData.result = await readAllTenantChannel({
        tenant_id: this.tenant_id
    });
    this.result = "list of channels"
  } catch (error) {
    this.error = error.message;
  }
});

Then("It should return the list of channels in result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("channel reading error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
