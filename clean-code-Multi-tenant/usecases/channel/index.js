const {employeeDb, channelDb } = require('../../database-access/index');
const { verifyToken } = require('../../middleware/token');
const CustomError = require('../../utilities/custom-error')
const createTenantChannel = require("./create-channel");
const updateTenantChannel = require("./update-channel");
const deleteTenantChannel = require("./delete-channel");
const readAllTenantChannel = require("./read-all-channel");
const readTenantChannelById = require("./read-channel");
const { channelData,updateChannelData,deleteChannelData, } = require('../../entities/index')

const insertIntoChannel = channelDb.insertIntoChannel;
const deleteInChannelTable = channelDb.deleteInChannelTable;
const updateInChannelTable = channelDb.updateInChannelTable;
const readChannelFromTable = channelDb.readChannelFromTable;
const readChannelFromTableById = channelDb.readChannelFromTableById;
const findPermission = employeeDb.findPermission;

const createChannel = createTenantChannel({
    verifyToken,
    findPermission,
    channelData,
    insertIntoChannel,
    CustomError
});


const updateChannel = updateTenantChannel({
    verifyToken,
    findPermission,
    updateChannelData,
    updateInChannelTable,
    CustomError
});

const deleteChannel = deleteTenantChannel({
    verifyToken,
    findPermission,
    deleteChannelData,
    deleteInChannelTable,
    CustomError
});

const readAllChannel = readAllTenantChannel({
    verifyToken,
    findPermission,
    readChannelFromTable,
    CustomError
});

const readChannelById = readTenantChannelById({
    verifyToken,
    findPermission,
    readChannelFromTableById,
    CustomError
});

module.exports =  {
    createChannel,
    updateChannel,
    deleteChannel,
    readAllChannel,
    readChannelById
}