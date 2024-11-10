module.exports = function updateEmployeeById({
    verifyToken,
    findPermission,
    updateEmployeeFields,
    CustomError
}
){
    return async function updateEmployee(data) {
        try {
            const flag = await verifyToken(data);
            if(flag){
                await findPermission(data, "update user",CustomError);
                await updateEmployeeFields(data,CustomError);
            } 
            else{
                throw new CustomError(401,"invalid token");
            }    
            
        } catch (error) {
            throw error; 
        }
    }
}