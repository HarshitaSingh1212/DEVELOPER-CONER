
module.exports = function addUsersAsEmployee(addUsers) {
    return async function addUsersInTenant(req, res) {
        try {
            const {employee_email, employee_name,permissions } = req.body
            await addUsers({employee_email, employee_name,permissions });
            res.statusCode = 201;
            res.end(JSON.stringify({
                status:"SUCCESS",
                msg:"User created successfully"
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