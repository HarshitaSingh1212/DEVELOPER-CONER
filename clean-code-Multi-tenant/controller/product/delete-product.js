module.exports = function deleteTenantProduct(deleteProduct){
    return async function deleteProductFromTenant(req, res) {
        try {
            const param = req.param;
            const headers = req.headers;
            await deleteProduct({param,headers});
            // res.statusCode =204;
            res.end(JSON.stringify({
                status:"SUCCESS",
                msg:"product deleted successfully"
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