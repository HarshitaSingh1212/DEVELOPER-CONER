const createTenantProduct = require("./create-product");
const updateTenantProduct= require("./update-product");
const deleteTenantProduct= require("./delete-product");
const readAllTenantProduct = require("./read-all-product");
const readTenantProductById = require("./read-product");
const {createProduct,updateProduct,deleteProduct,readAllProduct,readProductById} = require('../../usecases/index')

const createProductInTenant = createTenantProduct(createProduct);

const updateProductInTenant = updateTenantProduct(updateProduct);

const deleteProductFromTenant = deleteTenantProduct(deleteProduct);

const readAllProductInTenant = readAllTenantProduct(readAllProduct);

const readProductByIdInTenant = readTenantProductById(readProductById);

module.exports =  {
    createProductInTenant,
    updateProductInTenant,
    deleteProductFromTenant,
    readAllProductInTenant,
    readProductByIdInTenant
}