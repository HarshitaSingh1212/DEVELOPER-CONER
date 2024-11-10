module.exports = function createTenantProduct({
    verifyToken,
    findPermission,
    productData,
    generateUrl,
    findMaxProductId,
    insertInProductTable,
    insertIntoProductTranslationTable,
    CustomError
}){
    return async function createProduct(data) {
        try {
            if (data.image_url) {
                data.image_url = JSON.stringify(data.image_url);
            }
            let flag = await verifyToken(data);
            if (flag) {
                await findPermission(data, "create product",CustomError);
                    const {price,product_name,product_type,product_url,product_description} = data;
                    await productData({price,product_name,product_type,product_url,product_description});
                    if(data.param&&!data.param.productId)
                    await insertInProductTable(data, CustomError);
                    await findMaxProductId(data, CustomError);
                    await generateUrl(data);
                   
                    
                    await insertIntoProductTranslationTable(data, CustomError);
                }
                else{
                    throw new CustomError(401,"invalid token")
                }
            
        } catch (error) {
            throw error;
        }
    }
}