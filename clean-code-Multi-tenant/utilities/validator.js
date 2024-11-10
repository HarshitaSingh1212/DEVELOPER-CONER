const joi = require('joi')

const signUpSchema = joi.object({
    employee_name: joi.string().required(),
    tenant_name: joi.string().required(),
    employee_password: joi.string().required(),
    employee_email: joi.string().email().required()
});

const addUsersSchema = joi.object({
    employee_name: joi.string().max(255).required(),
    employee_email: joi.string().email().max(255).required(),
});

const loginEmailSchema = joi.object({
    employee_email: joi.string().email().required()
})

const loginTenantIdSchema = joi.object({
    tenant_id: joi.number().integer().required()
})

const productSchema = joi.object({
    price: joi.number().positive(),
    product_name: joi.string().max(255).required(),
    product_type: joi.string().max(255).required(),
    product_url: joi.string().uri().max(255).optional(),
    product_description: joi.string().max(65535).optional(),
});


const productUpdateSchema = joi.object({
    price: joi.number().positive().precision(10),
    product_name: joi.string().max(255),
    product_type: joi.string().max(255),
    product_url: joi.string().uri().max(255),
    product_description: joi.string().max(65535),
}).or('image_url', 'price', 'product_name', 'product_type', 'product_url', 'product_description');

const deleteProductSchema = joi.object({
    product_id: joi.number().integer().required()
})


const channelSchema = joi.object({
    tenant_id: joi.number().integer().required(),
    channel_code: joi.string().max(5).required(),
    channel_name: joi.string().max(255).required()
});

const channelUpdateSchema = joi.object({
    tenant_id: joi.number().integer().required(),
    channel_code: joi.string().max(255),
    channel_name: joi.string().max(255)
}).or('tenant_id', 'channel_code', 'channel_name');


const deleteChannelSchema = joi.object({
    channel_id: joi.number().integer().required()
})

module.exports = {
    signUpSchema,
    addUsersSchema,
    loginEmailSchema,
    loginTenantIdSchema,
    productSchema,
    productUpdateSchema,
    deleteProductSchema,
    channelSchema, 
    channelUpdateSchema,
    deleteChannelSchema
}