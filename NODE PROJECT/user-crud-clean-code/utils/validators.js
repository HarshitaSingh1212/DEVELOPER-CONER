const joi = require('joi')

const registerSchema = joi.object({
    id: joi.string().max(36).required(),
    firstName: joi.string().max(20).required(),
    lastName: joi.string().max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(/[0-9A-Za-z]{3,5}/).required(),
    createdAt: joi.date().required(),
    modifiedAt: joi.date().required(),
    deletedAt: null
})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(/[0-9A-Za-z]{3,5}/).required(),
})

const deleteSchema = joi.object({
    email: joi.string().email().required(),
})

const updateSchema = joi.object({
    data: joi.object({
        firstName: joi.string().max(20).required(),
        lastName: joi.string().max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(/[0-9A-Za-z]{3,5}/).required(),
    }),
    email: joi.string().email().required()
})

module.exports = {
    registerSchema, loginSchema, updateSchema, deleteSchema
}