module.exports = function setPasswordOfEmployee(setPassword){
    return async function setPasswordInEmployee(req,res){
        try{
            const param = req.param;
            const headers = req.headers;
            const query = req.query;
            const{employee_password} = req.body;
            await setPassword({param,headers,query,employee_password});
             res.statusCode = 201;
             res.end(JSON.stringify({
            status:"SUCCESS",
            msg:"password set successfully"
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
