
module.exports = function getEmployeePassword({
    verifyToken,
    checkCredentials,
    generateToken,
    CustomError
}) {
    return async function getPassword(data) {
        try {
            const flag = await verifyToken(data);
            if(flag){
                if(!data.employee_password){
                    throw new CustomError(400,'password is required')
                }
                data.employee_email = data.email;
                data.employee_id = data.id;
                await checkCredentials(data,CustomError);
                await generateToken(data);
            }
            else{
                throw new CustomError(401,"invalid token")
            }
           

        }
        catch (err) {
            throw err; 
        }
    }
}    