module.exports = function createTenantChannel(createChannel){
    return async function createChannelInTenant(req, res) {
        try {
            const param = req.param;
            const headers = req.headers;
            const {channel_name,channel_code} = req.body;
            await createChannel({param,headers,channel_name,channel_code});
            res.statusCode = 200;
            res.end(JSON.stringify({
                status:"SUCCESS",
                msg:"channel created successfully"
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