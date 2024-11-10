module.exports = function validateUpdateProductData(validateData){
    return async function updateProductData({
        price,
        product_name,
        product_type,
        product_url,
        product_description,
    }){
        const data = {
            price,
            product_name,
            product_type,
            product_url,
            product_description }

            try{
                await validateData(data);
            }
            catch(err){
                throw err;
            }
    }
};