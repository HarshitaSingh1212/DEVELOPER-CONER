module.exports = function readTenantChannelById({
    verifyToken,
    findPermission,
    readChannelFromTableById,
    CustomError
}){
    return async function readChannelById(data) {
        try {
            let flag = await verifyToken(data);
            if (flag) {
                await findPermission(data, "read channel",CustomError);
                const result =   await readChannelFromTableById(data,CustomError);
                if(result){
                    data.result = result;
                    return data;
                }
            }
            else{
                throw new CustomError(401,"invalid token");
            }
        } catch (error) {
            throw error;
        }
    }
}