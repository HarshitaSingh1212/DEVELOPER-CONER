const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildReadTenantChannel = require('./read-channel.js');
const CustomError = require('../../utilities/custom-error')
const mockData = {
  verifyToken: () => true, // or false for invalid token
  findPermission: () => {},
  readChannelFromTableById: () => ["channel1", "channel2"] // mock data for channel list
};

let verifyTokenStub;
let findPermissionStub;
let readChannelFromTableById;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  readChannelFromTableById = sandBox.stub(mockData, "readChannelFromTableById");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
   if(!args.tenant_id){
    return false;
   }
     return true;
  });
  findPermissionStub.callsFake(async () => {});
  readChannelFromTableById.callsFake(async (args) => {
    if(args.channel_id == '3')
        throw new CustomError(404,"channel id not found")
  });
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("read single channel by channel_id:{string} tenant_id: {string}", async (channel_id,tenant_id) => {
    this.channel_id = channel_id
    this.tenant_id=tenant_id
});

When("try to read single channels", async () => {
  const readChannelById = buildReadTenantChannel({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    readChannelFromTableById: mockData.readChannelFromTableById,
    CustomError
  });

  try {
    mockData.result = await readChannelById({
        channel_id: this.channel_id,
        tenant_id: this.tenant_id
    });
    this.result = "list of channels"
  } catch (error) {
    this.error = error.message;
  }
});

Then("It should return the single channels in result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("single channel reading error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
