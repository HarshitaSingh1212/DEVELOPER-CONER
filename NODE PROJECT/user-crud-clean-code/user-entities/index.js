const createMakeUser = require('./user')
const { v4: uuid } = require('uuid')
const joi = require('joi')
const { createHash } = require('../utils/crypto')
const { registerSchema } = require('../utils/validators')

module.exports = createMakeUser({
    generateId,
    validateData,
    createHash
})

function generateId() {
    return uuid()
}

async function validateData(data){
    return await registerSchema.validateAsync(data) 
}