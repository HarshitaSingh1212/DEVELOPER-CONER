module.exports = function validateProductData(validateData){
    return async function productData({
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
            product_description,
            }

            try{
                await validateData(data);
            }
            catch(err){
                throw err;
            }
    }
};