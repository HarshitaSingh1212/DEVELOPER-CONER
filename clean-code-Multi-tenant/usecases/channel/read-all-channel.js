module.exports = function readAllTenantChannel({
    verifyToken,
    findPermission,
    readChannelFromTable,
    CustomError
}){
    return async function readAllChannel(data) {
        try {
            let flag = await verifyToken(data);
            if (flag) {
               await findPermission(data,"read channel",CustomError);
              const result =   await readChannelFromTable(data,CustomError);
              if(result){
                data.result = result;
                return data;
              }
                
            }
            else{
                throw new CustomError(401,"invalid token")
            }
        } catch (error) {
            throw error;
        }
    }
}