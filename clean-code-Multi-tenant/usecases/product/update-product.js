module.exports = function updateTenantProduct({
    verifyToken,
    findPermission,
    updateProductData,
    updateInProductTable,
    updateInProductTranslationTable,
    CustomError
}) {
    return async function updateProduct(data) {
        try {
            if (data.image_url) {
                data.image_url = JSON.stringify(data.image_url);
            }
            let flag = await verifyToken(data);
            if (flag) {
                await findPermission(data, "update product",CustomError);
                const { product_id,price, product_name, product_type, product_url, product_description } = data;
                await updateProductData({ product_id,price, product_name, product_type, product_url, product_description });
                await updateInProductTable(data, CustomError);
                if(product_name||product_type||product_description)
                await updateInProductTranslationTable(data, CustomError);
            }
            else{
                throw new CustomError(401,"invalid token")
            }
        
        } catch (error) {
        throw error;
    }
}
}