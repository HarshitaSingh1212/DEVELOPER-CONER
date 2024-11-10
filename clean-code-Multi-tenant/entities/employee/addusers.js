module.exports = function validateAddUserData(validateData){
    return async function addUserData({
       employee_name,
       employee_email
    }){
        const data = {
            employee_name,
            employee_email}

            try{
                await validateData(data);
            }
            catch(err){
                throw err;
            }
    }
};