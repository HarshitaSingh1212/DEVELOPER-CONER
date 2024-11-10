module.exports = function updateTenantChannel({
    verifyToken,
    findPermission,
    updateChannelData,
    updateInChannelTable,
    CustomError
}){
    return async function updateChannel(data) {
        try {
            let flag = await verifyToken(data);
            if (flag) {
               await findPermission(data, "update channel",CustomError);
                    const {tenant_id,channel_name,channel_code} = data;
                    await updateChannelData({tenant_id,channel_name,channel_code});
                    await updateInChannelTable(data,CustomError);
                
            }
            else{
                throw new CustomError(401,"invalid token");
            }
        } catch (error) {
            throw error;
        }
    }
}