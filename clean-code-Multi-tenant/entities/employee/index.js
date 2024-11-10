const validateSignUpData = require('./signup');
const validateAddUserData = require('./addusers');
const validateLoginEmailData = require('./login-email');
const validateLoginTenantIdData = require('./login-tenant-id');
const { signUpSchema, addUsersSchema,loginEmailSchema,loginTenantIdSchema } = require('../../utilities/validator');

const signUpData =  validateSignUpData(validateDataForSignUp);
const addUserData = validateAddUserData(validateDataForAddUser);
const loginEmail = validateLoginEmailData(validateDataForLoginEmail)
const loginTenantId = validateLoginTenantIdData(validateDataForLoginTenantId);

const Joi = require('joi');

async function validateDataForSignUp(data) {
    try {
        return await signUpSchema.validateAsync(data);
    }  catch(error){
        throw error;
    }
}

async function validateDataForAddUser(data) {
    try {
         await addUsersSchema.validateAsync(data);
    }  catch(error){
        throw error;
    }
}

async function validateDataForLoginEmail(data) {
    try {
         await loginEmailSchema.validateAsync(data);
    }  catch(error){
        throw error;
    }
}

async function validateDataForLoginTenantId(data) {
    try {
         await loginTenantIdSchema.validateAsync(data);
    }  catch(error){
        throw error;
    }
}


module.exports = {
    signUpData,
    addUserData,
    loginEmail,
    loginTenantId
}