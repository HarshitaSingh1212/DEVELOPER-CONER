const employeeIndex = require("./employee/index");
const productIndex = require("./product/index");
const channelIndex = require("./channel/index");
const setPasswordIndex = require("./set-password/index");


const signUpForTenant =employeeIndex.signUpForTenant;
const addUsersInTenant = employeeIndex.addUsersInTenant;
const loginInTenant =employeeIndex.loginInTenant;
const getTenantPasswordOfTenant = employeeIndex.getPasswordOfTenant
const getPasswordOfTenant =employeeIndex.getPasswordOfTenant
const updateEmployeeInTenant = employeeIndex.updateEmployeeInTenant
const deleteEmployeeInTenant = employeeIndex.deleteEmployeeInTenant

const createProductInTenant = productIndex.createProductInTenant;
const updateProductInTenant = productIndex.updateProductInTenant;
const deleteProductFromTenant =productIndex.deleteProductFromTenant
const readAllProductInTenant = productIndex.readAllProductInTenant;
const readProductByIdInTenant = productIndex.readAllProductInTenant;

const setPasswordInEmployee = setPasswordIndex.setPasswordInEmployee;
const createChannelInTenant = channelIndex.createChannelInTenant;
const updateChannelInTenant = channelIndex.updateChannelInTenant;
const deleteChannelIntenant = channelIndex.deleteChannelIntenant;
const readAllChannelInTenant = channelIndex.readAllChannelInTenant;
const readChannelByIdInTenant = channelIndex.readAllChannelInTenant;

module.exports = {
    signUpForTenant,
    addUsersInTenant,
    loginInTenant,
    getTenantPasswordOfTenant,
    getPasswordOfTenant,
    updateEmployeeInTenant,
    deleteEmployeeInTenant,
    createProductInTenant,
    updateProductInTenant,
    deleteProductFromTenant,
    readAllProductInTenant,
    readProductByIdInTenant,
    setPasswordInEmployee,
    createChannelInTenant,
    updateChannelInTenant,
    deleteChannelIntenant,
    readAllChannelInTenant,
    readChannelByIdInTenant
}