module.exports = function deleteTenantChannel(deleteChannel){
    return async function deleteChannelIntenant(req,res) {
        try {
            const param = req.param;
            const headers = req.headers;
           await deleteChannel({param, headers});
           res.end(JSON.stringify({
            status:"SUCCESS",
            msg:"channel deleted successfully"
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