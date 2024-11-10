module.exports = function getTenantEmployeePassword(getTenantPassword){
    return async function getTenantPasswordOfTenant(req, res) {
        try {
            const param = req.param;
            const headers = req.headers;
            const {tenant_id} = req.body; 
           const data = await getTenantPassword({param, headers, tenant_id});
           res.setHeader('Set-Cookie', `jwtToken=${data.jwTtoken}; Max-Age=${data.twoHoursInMillis}; Secure; Path=/; SameSite=None`);
           res.statusCode = 200;
           res.end(JSON.stringify({
            msg:"Enter password for the given tenant id"
           }))
        }
        catch (error) {
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