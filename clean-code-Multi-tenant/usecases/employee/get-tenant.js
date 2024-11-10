module.exports = function getTenantEmployeePassword({
    loginTenantId,
    generateToken,
    verifyToken, 
    CustomError
}){
    return async function getTenantPassword(data) {
        try {
            let flag = verifyToken(data);
            if(flag){
                const {tenant_id} = data;
                if(!tenant_id){
                    throw new CustomError(404,"tenant id is required")
                }
                data.employee_email = data.email;
                await loginTenantId({tenant_id});
                generateToken(data);
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