const employeeIndex = require("./employee/index");
const productIndex = require("./product/index");
const channelIndex = require("./channel/index");
const setPasswordIndex = require("./set-password/index");


const signUp = employeeIndex.signUp;
const addUsers = employeeIndex.addUsers;
const login = employeeIndex.login;
const getTenantPassword = employeeIndex.getTenantPassword
const getPassword = employeeIndex.getPassword;
const updateEmployee = employeeIndex.updateEmployee;
const deleteEmployee = employeeIndex.deleteEmployee;

const createProduct = productIndex.createProduct;
const updateProduct = productIndex.updateProduct;
const deleteProduct = productIndex.deleteProduct;
const readAllProduct = productIndex.readAllProduct;
const readProductById = productIndex.readProductById;

const createChannel = channelIndex.createChannel;
const updateChannel = channelIndex.updateChannel;
const deleteChannel = channelIndex.deleteChannel;
const readAllChannel = channelIndex.readAllChannel;
const readChannelById = channelIndex.readChannelById;

const setPassword = setPasswordIndex.setPassword;

module.exports = {
    signUp,
    addUsers,
    login,
    getTenantPassword,
    getPassword,
    updateEmployee,
    deleteEmployee,
    createProduct,
    updateProduct,
    deleteProduct,
    readAllProduct,
    readProductById,
    createChannel,
    updateChannel,
    deleteChannel,
    readAllChannel,
    readChannelById,
    setPassword
}