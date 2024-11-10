
module.exports = function updateEmployeeById(updateEmployee){
    return async function updateEmployeeInTenant(req,res) {
        try {
            const param = req.param;
            const headers = req.headers;
            const {employee_name,employee_status,permissions} = req.body;
            await updateEmployee({param,headers,employee_name,employee_status,permissions});
            res.statusCode = 201;
            res.end(JSON.stringify({
                status:"SUCCESS",
                msg:"Employee updated successfully"
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