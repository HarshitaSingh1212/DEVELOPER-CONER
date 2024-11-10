const buildCreateUser = require('./create-user')
const buildGetUserFromEmail = require('./get-user-from-email')
const buildUpdateUserFromEmail = require('./update-user-from-email')
const buildDeleteUserFromEmail = require('./delete-user-from-email')

const { userDb } = require('../data-source/')

const createUser = buildCreateUser(userDb)
const getUserFromEmail = buildGetUserFromEmail(userDb)
const updateUserFromEmail = buildUpdateUserFromEmail(userDb)
const deleteUserFromEmail = buildDeleteUserFromEmail(userDb)

module.exports = {
    createUser, getUserFromEmail, updateUserFromEmail, deleteUserFromEmail
}