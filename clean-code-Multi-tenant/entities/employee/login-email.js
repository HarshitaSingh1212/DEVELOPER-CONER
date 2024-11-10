module.exports = function validateLoginEmailData(validateData){
    return async function loginEmail({
       employee_email
    }){
        const data = { 
            employee_email,
            }

            try{
                await validateData(data);
            }
            catch(err){
                throw err;
            }
    }
};