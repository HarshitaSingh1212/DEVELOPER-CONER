const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildDeleteTenantChannel = require('./delete-channel.js');
const CustomError = require("../../utilities/custom-error.js");

const mockData = {
  verifyToken: () => {}, 
  findPermission: () => {},
  deleteChannelData: () => {},
  deleteInChannelTable: () => {}
};

let verifyTokenStub;
let findPermissionStub;
let deleteChannelDataStub;
let deleteInChannelTableStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  deleteChannelDataStub = sandBox.stub(mockData, "deleteChannelData");
  deleteInChannelTableStub = sandBox.stub(mockData, "deleteInChannelTable");
});

Before(() => {
    verifyTokenStub.callsFake(async (agrs) => {
        return true; 
      });
  findPermissionStub.callsFake(async () => {});

  deleteChannelDataStub.callsFake(async (args) => {
    console.log(args,  "args")
    if(args.channel_id&&args.channel_id == 1234)
        throw new CustomError(404,"channel not found");
  });
  deleteInChannelTableStub.callsFake(async () => {});
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("channel_id: {string}", (channel_id) => {
    this.channel_id = channel_id
    console.log(channel_id, " idddddddd")
});

When("try to delete channel by ID", async () => {
  const deleteTenantChannel = buildDeleteTenantChannel({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    deleteChannelData: mockData.deleteChannelData,
    deleteInChannelTable: mockData.deleteInChannelTable,
    CustomError
  });

  try {
    await deleteTenantChannel({
        param:{channelId: this.channel_id},
    });
    this.result = "channel deleted successfully";
  } catch (error) {
    console.log(error);
    this.error = error.message;
  }
});

Then("channel deleted result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

// Then("channel deletion error: {string}", async (error) => {
//     expect(this.error).to.be.equal(error);
// });
