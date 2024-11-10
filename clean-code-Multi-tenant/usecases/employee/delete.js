module.exports = function deleteEmployeeById({
    verifyToken,
    findPermission,
    deleteEmployeeInEmployees,
    CustomError
}
){
   return async function deleteEmployee(data) {
           try{
            const flag = await verifyToken(data);
            if(flag){
                await findPermission(data,"delete user",CustomError);
                await deleteEmployeeInEmployees(data,CustomError);
            }
            else{
                throw new CustomError(401,"invalid token");
            }
           
           }
           catch (error) {
            throw error;
        }
    }
}