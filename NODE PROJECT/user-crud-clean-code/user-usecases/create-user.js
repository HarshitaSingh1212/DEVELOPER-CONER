const makeUser = require('../user-entities')

module.exports = function buildCreateUser(userDb){
    return async function createUser(data){
        const userData = await makeUser(data)
        await userDb.createUser(userData)
    }
}