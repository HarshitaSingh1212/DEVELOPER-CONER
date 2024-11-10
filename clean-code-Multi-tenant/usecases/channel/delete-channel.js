module.exports = function deleteTenantChannel({
    verifyToken,
    findPermission,
    deleteChannelData,
    deleteInChannelTable,
    CustomError
}){
    return async function deleteChannel(data) {
        try {
            let flag = await verifyToken(data);
            if (flag) {
               await findPermission(data, "delete channel",CustomError);
               
                    const channel_id = data.param.channelId;
                    await deleteChannelData({channel_id});
                    await deleteInChannelTable(data,CustomError );
                
            }
            else{
                throw new CustomError(401,"invalid token");
            }
        } catch (error) {
            throw error;
        }
    }
}