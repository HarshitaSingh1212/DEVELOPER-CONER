module.exports = function setPasswordOfEmployee({
    verifyToken,
    hashedPassword,
    insertPasswordIntoEmployees,
    CustomError
}){
    return async function setPassword(data){
        let flag =  await verifyToken(data);
        if(flag){
         await hashedPassword(data);
         await insertPasswordIntoEmployees(data,CustomError);
        }
        else{
            throw new CustomError(401,"invalid token")
        }
     }
}
