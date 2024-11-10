module.exports = function buildGetUserFromEmail(userDb){
    return async function getUserFromEmail(email){
        return await userDb.findUserByEmail(email)
    }
}