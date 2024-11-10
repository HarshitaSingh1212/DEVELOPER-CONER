module.exports = function deleteTenantProduct({
    verifyToken,
    findPermission,
    deleteProductData,
    deleteInProductTable,
    CustomError
}){
    return async function deleteProduct(data) {
        try {
            let flag = await verifyToken(data);
            if (flag) {
                await findPermission(data, "delete product",CustomError);
               
                    const product_id = data.param.productId;
                    await deleteProductData({product_id})
                    await deleteInProductTable(data, CustomError);
                
            }
            else{
                throw new CustomError(401,"invalid token")
            }
        } catch (error) {
            throw error;
        }
    }
}