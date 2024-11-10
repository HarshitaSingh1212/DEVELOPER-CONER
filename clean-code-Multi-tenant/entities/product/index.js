const validateProductData = require('./product');
const validateUpdateProductData = require('./update-product');
const validateDeleteProductData = require('./delete-product');
const {productSchema,productUpdateSchema,deleteProductSchema} = require('../../utilities/validator');

const productData = validateProductData(validateDataForProduct);
const updateProductData = validateUpdateProductData(validateDataForUpdateProduct);
const deleteProductData = validateDeleteProductData(validateDataForDeleteProduct);

const Joi = require('joi');

async function validateDataForProduct(data) {
    try {
         await productSchema.validateAsync(data);
    }  catch(error){
        throw error;
    }
}

async function validateDataForUpdateProduct(data) {
    try {
         await productUpdateSchema.validateAsync(data);
    }  catch(error){
        throw error;
    }
}

async function validateDataForDeleteProduct(data) {
    try {
        return await deleteProductSchema.validateAsync(data);
    }  catch(error){
        throw error;
    }
}


module.exports = {
    productData,
    updateProductData,
    deleteProductData
}