module.exports = function validateSignUpData(validateData){
    return async function signUpData({
       tenant_name,
       employee_name,
       employee_email,
       employee_password
    }){
        const data = {  tenant_name,
            employee_name,
            employee_email,
            employee_password }
            try{
                await validateData(data);
            }
            catch(err){
                throw err;
            }
    }
};