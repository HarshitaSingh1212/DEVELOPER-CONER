module.exports = function buildDeleteUserFromEmail(userDb){
    return async function deleteUserFromEmail(email){
        await userDb.softDeleteUserByEmail(email)
    }
}