module.exports = function loginEmployee({
    generateToken,
    loginEmail,
    getTenantList,
    CustomError
}){
    return async function login(data) {
        try {
            
            const {employee_email} = data;
            if(!employee_email){
                throw new CustomError(400,"email is required field");
            }
            await generateToken(data);
            await loginEmail({employee_email});
           const result =  await getTenantList(data, CustomError);
           if(result){
            data.result = result;
            return data;
           }
            
        }
        catch (err) {
            throw err;
        }
    }   
}