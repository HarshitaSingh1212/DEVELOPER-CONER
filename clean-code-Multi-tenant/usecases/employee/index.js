const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';
const { generateToken,verifyToken } = require('../../middleware/token')
const {tenantDb,employeeDb, channelDb } = require('../../database-access/index')
const hashedPassword = require('../../utilities/hash-password')
const CustomError = require('../../utilities/custom-error')
const sendEmail = require('../../utilities/email');
const signUpTenant = require("./signup");
const addUsersAsEmployee = require("./addusers");
const loginEmployee = require("./login");
const getTenantEmployeePassword = require("./get-tenant");
const getEmployeePassword = require("./get-tenant-password");
const updateEmployeeById = require("./update");
const deleteEmployeeById = require("./delete");
const { signUpData,addUserData ,loginEmail,loginTenantId,} = require('../../entities/index');


async function generateEmployeeId(data) {
    const uuid = uuidv4();
    const employee_Id = uuid;
    data.employee_id = employee_Id;
}

async function generateTokenForAddingUser(data) {
    const { employee_id, employee_email, tenant_id } = data;
    console.log(tenant_id);
    const payload = {
        id: employee_id,
        email: employee_email,
        tenant_id: tenant_id
    };
    const options = {
        expiresIn: '1h'
    };
    const token = jwt.sign(payload, secretKey, options);
    console.log("token:",token);
    data.token = token;
}

const insertDataIntoTableTenats = tenantDb.insertDataIntoTableTenats;
const insertDataIntoTableEmployees = employeeDb.insertDataIntoTableEmployees;
const insertIntoChannelTable = channelDb.insertIntoChannelTable;
const getTenantList = tenantDb.getTenantList;
const checkCredentials = employeeDb.checkCredentials;
const findPermission = employeeDb.findPermission;
const updateEmployeeFields = employeeDb.updateEmployeeFields;
const deleteEmployeeInEmployees = employeeDb.deleteEmployeeInEmployees;

const signUp = signUpTenant({
    generateEmployeeId,
    hashedPassword,
    signUpData,
    insertDataIntoTableTenats,
    insertDataIntoTableEmployees,
    insertIntoChannelTable,
    generateToken,
    CustomError
});


const addUsers = addUsersAsEmployee({
    verifyToken,
    findPermission,
    generateEmployeeId,
    generateTokenForAddingUser,
    addUserData,
    insertDataIntoTableEmployees,
    sendEmail,
    CustomError
});


const login = loginEmployee({
    generateToken,
    loginEmail,
    getTenantList,
    CustomError
});

const getTenantPassword = getTenantEmployeePassword({
    loginTenantId,
    generateToken,
    verifyToken,
    CustomError
});

const getPassword = getEmployeePassword({
    verifyToken,
    checkCredentials,
    generateToken,
    CustomError
});

const updateEmployee = updateEmployeeById({
    verifyToken,
    updateEmployeeFields,
    findPermission,
    CustomError
}); 

const deleteEmployee = deleteEmployeeById({
    verifyToken,
    findPermission,
    deleteEmployeeInEmployees,
    CustomError
}); 


module.exports =  {
    signUp,
    addUsers,
    login,
    getPassword,
    getTenantPassword,
    updateEmployee,
    deleteEmployee
}
