module.exports = function createTenantChannel({
    verifyToken,
    findPermission,
    channelData,
    insertIntoChannel,
    CustomError
}){
    return async function createChannel(data) {
        try {
            let flag = await verifyToken(data);
            if (flag) {
                 await findPermission(data, "create channel",CustomError);
               
                    const {tenant_id,channel_name,channel_code} = data;
                    await channelData({tenant_id,channel_name,channel_code});
                    await insertIntoChannel(data, CustomError);
                
            }
            else{
                throw new CustomError(401, "Invalid Token");
            }
        } catch (error) {
            throw error;
        }
    }
}