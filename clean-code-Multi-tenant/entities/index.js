const channelIndex = require('./channel/index');
const productIndex = require('./product/index');
const employeeIndex = require('./employee/index');

const channelData = channelIndex.channelData
const updateChannelData = channelIndex.updateChannelData
const deleteChannelData = channelIndex.deleteChannelData;

const signUpData =  employeeIndex.signUpData;
const addUserData = employeeIndex.addUserData;
const loginEmail = employeeIndex.loginEmail;
const loginTenantId = employeeIndex.loginTenantId;

const productData = productIndex.productData;
const updateProductData = productIndex.updateProductData;
const deleteProductData = productIndex.deleteProductData;

module.exports = {
channelData,
updateChannelData,
deleteChannelData,
signUpData,
addUserData ,
loginEmail,
loginTenantId,
productData,
updateProductData,
deleteProductData,
}