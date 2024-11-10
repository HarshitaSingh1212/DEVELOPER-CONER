module.exports = function loginEmployee(login){
    return async function loginInTenant(req, res) {
        try {
            const param = req.param;
            const headers = req.headers;
            const {employee_email} = req.body; 
           const data = await login({param, headers, employee_email});
           res.setHeader('Set-Cookie', `jwtToken=${data.jwTtoken}; Max-Age=${data.twoHoursInMillis}; Secure; Path=/; SameSite=None`);
           res.statusCode = 200;
           res.end(JSON.stringify({
            data:data.result
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