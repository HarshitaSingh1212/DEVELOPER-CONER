const { createUser, getUserFromEmail, updateUserFromEmail, deleteUserFromEmail } = require('../user-usecases/')
const response = require('../constants/response')
const { verifyHash } = require('../utils/crypto')
const { updateSchema, loginSchema, deleteSchema } = require('../utils/validators')

async function registerUser(req, res){
    try {
        await createUser(req.body)
        response.success({
            data: 'User created successfully.'
        }, res)    
    }
    catch(err){
        res.statusCode = 400
        response.error({
            data: err.message
        }, res)
    }
}

async function loginUser(req, res){
    try {
        const body = await loginSchema.validateAsync(req.body)

        const data = await getUserFromEmail(body.email)
        const isUserVerified = await verifyHash({ data: body.password, hash: data.password })

        if (!isUserVerified) throw new Error('Incorrect password.')

        response.success({
            data: 'User authenticated successfully.'
        }, res)    
    }
    catch(err){
        res.statusCode = 400
        response.error({
            data: err.message
        }, res)
    }
}

async function updateUser(req, res){
    try {
        const body = await updateSchema.validateAsync(req.body)

        await updateUserFromEmail({
            data: body.data,
            email: body.email
        })
        response.success({
            data: 'User authenticated successfully.'
        }, res)    
    }
    catch(err){
        res.statusCode = 400
        response.error({
            data: err.message
        }, res)
    }
}

async function deleteUser(req, res){
    try {
        const body = await deleteSchema.validateAsync(req.body)

        await deleteUserFromEmail(body.email)
        response.success({
            data: 'User deleted successfully.'
        }, res)    
    }
    catch(err){
        res.statusCode = 400
        response.error({
            data: err.message
        }, res)
    }
}

module.exports = {
    registerUser, loginUser, updateUser, deleteUser
}