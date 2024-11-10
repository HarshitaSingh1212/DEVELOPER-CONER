module.exports = function createTenantProduct(createProduct){
    return async function createProductInTenant(req, res) {
        try {
            const param = req.param;
            const headers = req.headers;
            const {price,product_name,product_type,product_url,product_description,image_url} = req.body;
           await createProduct(price,product_name,product_type,product_url,product_description,image_url,param,headers);
           res.statusCode = 201;
           res.end(JSON.stringify({
            status:"SUCCESS",
            msg:"product created successfully"
           }))
        }catch (error) {
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