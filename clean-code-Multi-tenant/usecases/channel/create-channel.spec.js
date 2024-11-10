const { Given, When, Then, BeforeAll, Before, After, AfterAll } = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();

const buildCreateTenantChannel = require('./create-channel.js');
const CustomError = require("../../utilities/custom-error.js");

const mockData = {
  verifyToken: () => true,
  findPermission: () => {},
  channelData: () => {},
  insertIntoChannel: () => {}
};

let verifyTokenStub;
let findPermissionStub;
let channelDataStub;
let insertIntoChannelStub;

BeforeAll(() => {
  verifyTokenStub = sandBox.stub(mockData, "verifyToken");
  findPermissionStub = sandBox.stub(mockData, "findPermission");
  channelDataStub = sandBox.stub(mockData, "channelData");
  insertIntoChannelStub = sandBox.stub(mockData, "insertIntoChannel");
});

Before(() => {
  verifyTokenStub.callsFake(async (args) => true)
  findPermissionStub.callsFake(async () => {});
  channelDataStub.callsFake(async (args) => {
    if(!args.channel_name)
        throw new CustomError(400, "channel_name is required field");

      if(!args.channel_code)
        throw new CustomError(400,"channel_code is required field")
  });
  insertIntoChannelStub.callsFake(async () => {});
});

After(() => {
  sandBox.resetHistory();
});

AfterAll(() => {
  sandBox.restore();
});

Given("channel_name: {string} channel_code: {string}", (channel_name,channel_code) => {
    this.channel_name = channel_name,
    this.channel_code = channel_code
});

When("try to create channel", async () => {
  const createTenantChannel = buildCreateTenantChannel({
    verifyToken: mockData.verifyToken,
    findPermission: mockData.findPermission,
    channelData: mockData.channelData,
    insertIntoChannel: mockData.insertIntoChannel,
    CustomError
  });

  try {
    await createTenantChannel({
    channel_name: this.channel_name,
    channel_code: this.channel_code
});
    this.result = "channel created successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then("successful creation result: {string}", async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then("channel creation error: {string}", async (error) => {
    expect(this.error).to.be.equal(error);
});
