module.exports = function getEmployeePassword(getPassword){
    return async function getPasswordOfTenant(req, res) {
        try { 
          const param = req.param;
          const headers = req.headers;
          const {employee_password} = req.body;
          const data = await getPassword({param, headers, employee_password});
          res.setHeader('Set-Cookie', `jwtToken=${data.jwTtoken}; Max-Age=${data.twoHoursInMillis}; Secure; Path=/; SameSite=None`);
          res.statusCode = 200;
          res.end(JSON.stringify({
            status:"SUCCESS",
            msg:"Welcome, login is Successfull"
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