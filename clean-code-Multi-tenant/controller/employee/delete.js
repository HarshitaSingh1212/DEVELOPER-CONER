module.exports = function deleteEmployeeById(deleteEmployee){
   return async function deleteEmployeeInTenant(req, res) {
        try {
            const param = req.param;
            const headers = req.headers;
           await deleteEmployee({param, headers});
        //    res.statusCode = 204;
           res.end(JSON.stringify({
            status:"SUCCESS",
            msg:"Employee deleted successfully"
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