const {employeeDb } = require('../../database-access/index')
const { verifyToken } = require('../../middleware/token')
const hashedPassword = require("../../utilities/hash-password");
const setPasswordOfEmployee = require('./set-password');
const CustomError = require('../../utilities/custom-error')

const insertPasswordIntoEmployees = employeeDb.insertPasswordIntoEmployees;

const setPassword = setPasswordOfEmployee({
    verifyToken,
    hashedPassword,
    insertPasswordIntoEmployees,
    CustomError
})

module.exports = {
    setPassword,
    CustomError
}