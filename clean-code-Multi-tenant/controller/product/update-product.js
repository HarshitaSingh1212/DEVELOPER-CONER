module.exports = function updateTenantProduct(updateProduct){
    return async function updateProductInTenant(req, res) {
        try {
            const param = req.param;
            const headers = req.headers;
            const {price,product_description,image_url,product_type} = req.body;
            await updateProduct({param,headers,price,product_description,image_url,product_type});
            res.statusCode = 201;
            res.end(JSON.stringify({
                status:"SUCCESS",
                msg:"Product updated successfully"
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