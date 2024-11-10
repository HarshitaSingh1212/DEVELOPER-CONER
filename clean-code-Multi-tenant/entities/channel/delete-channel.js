module.exports = function validateDeleteChannelData(validateData){
    return async function deleteChannelData({
        channel_id
    }){
        const data = { 
            channel_id}
            try{
                await validateData(data);
            }
            catch(err){
                throw err;
            }
    }
}