module.exports = function readAllTenantProduct({
    verifyToken,
    findPermission,
    fetchAllProduct,
    CustomError
}){
    return async function readAllProduct(data) {
        try {
            let flag = await verifyToken(data);
            if (flag) {
                await findPermission(data, "read product",CustomError);
                const result = await fetchAllProduct(data, CustomError);
                 if(result)
                    return result;
                
            }
            else{
                throw new CustomError(401,"invalid token")
            }
        } catch (error) {
            throw error;
        }
    }
}