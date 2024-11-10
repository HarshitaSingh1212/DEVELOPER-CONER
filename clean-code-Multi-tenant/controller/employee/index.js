const signUpTenant = require("./signup");
const addUsersAsEmployee = require("./addusers");
const loginEmployee = require("./login");
const getTenantEmployeePassword = require("./get-tenant");
const getEmployeePassword = require("./get-tenant-password");
const updateEmployeeById = require("./update");
const deleteEmployeeById = require("./delete");
const { signUp,addUsers,login,getTenantPassword,getPassword,updateEmployee,deleteEmployee} = require('../../usecases/index'); 

const signUpForTenant = signUpTenant(signUp);

const addUsersInTenant = addUsersAsEmployee(addUsers);

const loginInTenant = loginEmployee(login);

const getTenantPasswordOfTenant = getTenantEmployeePassword(getTenantPassword);

const getPasswordOfTenant = getEmployeePassword(getPassword);

const updateEmployeeInTenant = updateEmployeeById(updateEmployee); 

const deleteEmployeeInTenant = deleteEmployeeById(deleteEmployee); 

module.exports =  {
    signUpForTenant,
    addUsersInTenant,
    loginInTenant,
    getTenantPasswordOfTenant,
    getPasswordOfTenant,
    updateEmployeeInTenant,
    deleteEmployeeInTenant
}
