const makeUser = require('../user-entities')

module.exports = function buildUpdateUserFromEmail(userDb){
    return async function updateUserFromEmail({
        data,
        email
    }){
        const userData = await makeUser(data)
        await userDb.updateUserByEmail({ data: userData, email })
    }
}