const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildUpdateTenantChannel = require('./update-channel.js');
const CustomError = require('../../utilities/custom-error')

const mockData = {
  verifyToken: () => true, // or false for invalid token
  findPermission: () => {},
  updateChannelData: () => {}, // mock data for channel list
  updateInChannelTable: () => {}
};

let verifyTokenStub;
let findPermissionStub;
let updateChannelDataStub;
let updateInChannelTableStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  updateChannelDataStub = sandBox.stub(mockData, "updateChannelData");
  updateInChannelTableStub = sandBox.stub(mockData, "updateInChannelTable");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => {
   if(!args.tenant_id){
    return false;
   }
     return true;
  });
  findPermissionStub.callsFake(async () => {});
  updateChannelDataStub.callsFake(async () => {});
  updateInChannelTableStub.callsFake(async (args) => {
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

Given("update channel by channel_id:{string} tenant_id: {string}", async (channel_id,tenant_id) => {
    this.channel_id = channel_id
    this.tenant_id=tenant_id
});

When("try to update channels", async () => {
  const readChannelById = buildUpdateTenantChannel({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    updateChannelData: mockData.updateChannelData,
    updateInChannelTable: mockData.updateInChannelTable,
    CustomError
  });

  try {
    mockData.result = await readChannelById({
        channel_id: this.channel_id,
        tenant_id: this.tenant_id
    });
    this.result = "channel updated successfully"
  } catch (error) {
    this.error = error.message;
  }
});

Then("It should return the update message in result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("channel updating error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
