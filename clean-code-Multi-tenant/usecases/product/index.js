const {employeeDb, productDb } = require('../../database-access/index')
const { verifyToken } = require('../../middleware/token')
const CustomError = require('../../utilities/custom-error')
const createTenantProduct = require("./create-product");
const updateTenantProduct= require("./update-product");
const deleteTenantProduct= require("./delete-product");
const readAllTenantProduct = require("./read-all-product");
const readTenantProductById = require("./read-product");
const { productData,updateProductData,deleteProductData} = require('../../entities/index');

async function generateUrl(req) {

    let product = {
        id: req.body.maxId,
        name: req.body.product_name,
        channelCode: req.param.channelCode
    };
    let baseUrl;
    if (req.param && req.param.channelCode)
        baseUrl = `http://localhost:5000/product/${product.id}/${product.channelCode}`;
    else {
        baseUrl = `http://localhost:5000/product/${product.id}/en`;
    }

    req.body.product_url = baseUrl;
}

const insertInProductTable = productDb.insertInProductTable;
const insertIntoProductTranslationTable = productDb.insertIntoProductTranslationTable;
const updateInProductTable = productDb.updateInProductTable;
const updateInProductTranslationTable = productDb.updateInProductTranslationTable;
const deleteInProductTable = productDb.deleteInProductTable;
const fetchAllProduct = productDb.fetchAllProduct;
const fetchProduct = productDb.fetchProduct;
const findPermission = employeeDb.findPermission;
const findMaxProductId = productDb.findMaxProductId;

const createProduct = createTenantProduct({
    verifyToken,
    findPermission,
    productData,
    findMaxProductId,
    generateUrl,
    insertInProductTable,
    insertIntoProductTranslationTable,
    CustomError
});


const updateProduct = updateTenantProduct({
    verifyToken,
    findPermission,
    updateProductData,
    updateInProductTable,
    updateInProductTranslationTable,
    CustomError
});

const deleteProduct = deleteTenantProduct({
    verifyToken,
    findPermission,
    deleteProductData,
    deleteInProductTable,
    CustomError
});

const readAllProduct = readAllTenantProduct({
    verifyToken,
    findPermission,
    fetchAllProduct,
    CustomError
});

const readProductById = readTenantProductById({
    verifyToken,
    findPermission,
    fetchProduct,
    CustomError
});

module.exports =  {
    createProduct,
    updateProduct,
    deleteProduct,
    readAllProduct,
    readProductById,
    CustomError
}