module.exports = function validateUpdateChannelData(validateData){
    return async function updateChannelData({
        tenant_id,
        channel_name,
        channel_code
    }){
        const data = { 
            tenant_id,
            channel_name,
            channel_code }

            try{
                await validateData(data);
            }
            catch(err){
                throw err;
            }
    }
};