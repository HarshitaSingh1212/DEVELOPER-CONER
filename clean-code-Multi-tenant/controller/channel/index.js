const createTenantChannel = require("./create-channel");
const updateTenantChannel = require("./update-channel");
const deleteTenantChannel = require("./delete-channel");
const readAllTenantChannel = require("./read-all-channel");
const readTenantChannelById = require("./read-channel");
const {createChannel,updateChannel,deleteChannel,readAllChannel,readChannelById} = require('../../usecases/index');

const createChannelInTenant = createTenantChannel(createChannel);

const updateChannelInTenant = updateTenantChannel(updateChannel);

const deleteChannelIntenant = deleteTenantChannel(deleteChannel);

const readAllChannelInTenant = readAllTenantChannel(readAllChannel);

const readChannelByIdInTenant = readTenantChannelById(readChannelById);

module.exports =  {
    createChannelInTenant,
    updateChannelInTenant,
    deleteChannelIntenant,
    readAllChannelInTenant,
    readChannelByIdInTenant
}