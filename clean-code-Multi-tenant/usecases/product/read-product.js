module.exports = function readTenantProductById({
    verifyToken,
    findPermission,
    fetchProduct,
    CustomError
}){
    return async function readProductById(data) {
        try {
            let flag = await verifyToken(data);
            if (flag) {
                try{
                    await findPermission(data,"read product",CustomError);
                    const result =  await fetchProduct(data, CustomError);
                     console.log("result", result);
                         return result;
                }
                catch(error){
                    console.error("Error in readProduct:", error);
                    throw error;
                }
                
            }
            else{
                throw new CustomError(401,"invalid token")
            }
        } catch (error) {
            throw error;
        }
    }
}