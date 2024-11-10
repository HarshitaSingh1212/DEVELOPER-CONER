module.exports = function validateDeleteProductData(validateData ){
    return async function deleteProductData({
        product_id
    }){
        const data = { 
            product_id}

            try{
                await validateData(data);
            }
            catch(err){
                throw err;
            }
    }
};