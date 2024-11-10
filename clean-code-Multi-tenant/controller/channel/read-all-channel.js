module.exports = function readAllTenantChannel(readAllChannel){
    return async function readAllChannelInTenant(req, res) {
        try {
            const param = req.param;
            const headers = req.headers;
         const data =  await readAllChannel({param,headers});
          res.statusCode = 200;
          res.end(JSON.stringify({
            data : data.result
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