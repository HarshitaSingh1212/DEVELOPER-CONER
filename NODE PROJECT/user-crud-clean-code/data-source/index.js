const createUserDb = require('./user-db')
const db = require('./database')

const userDb = createUserDb(db)

module.exports = {
    userDb
}