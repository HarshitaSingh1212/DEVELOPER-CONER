module.exports = function signUpTenant(signUp){
    return async function signUpForTenant(req,res) {
        try {
            const param = req.param;
            const headers = req.headers;
            const {employee_email, employee_name,tenant_name,employee_password} = req.body;
          const data = await signUp({employee_email, employee_name,tenant_name,employee_password,headers,param});
           res.setHeader('Set-Cookie', `jwtToken=${data.jwTtoken}; Max-Age=${data.twoHoursInMillis}; Secure; Path=/; SameSite=None`);
           res.statusCode = 201;
           res.end(JSON.stringify({
            status:"SUCCESS",
            msg:"Sign up successfull"
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
