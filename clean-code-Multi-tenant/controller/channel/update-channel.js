module.exports = function updateTenantChannel(updateChannel){
    return async function updateChannelInTenant(req, res) {
        try {
            const param = req.param;
            const headers = req.headers;
            const {channel_name,channel_code} = req.body;
            await updateChannel(param, headers,channel_code,channel_name);
            res.statusCode = 200;
            res.end(JSON.stringify({
                status:"SUCCESS",
                msg:"channel updated successfully"
            }))
        } catch (error) {
            console.log(error)
            if(error.status)
                res.statusCode = error.status;
                else
                res.statusCode = 500;

                const errorMsg = error.msg ? error.msg : error.message;    
                res.end(JSON.stringify({
                    status:"FAILED",
                    msg:errorMsg
                   }));
        }
    }
}