module.exports = function validateChannelData(validateData){
    return async function channelData({
        tenant_id,
        channel_name,
        channel_code
    }){
        const data = {  tenant_id,
            channel_name,
            channel_code }
        try{
            await validateData(data);
        }
        catch(err){
            throw err;
        }
    }
}