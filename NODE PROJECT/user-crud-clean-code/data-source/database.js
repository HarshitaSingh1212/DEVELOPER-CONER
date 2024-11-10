const Sequelize = require('sequelize')

const sequelize = new Sequelize('sample', 'keval', 'Rapid@5623', {
    host: 'localhost',
    dialect: 'mysql'
});

const db = {
    async query(_query, option){
        try {
            const queryResult = await sequelize.query(_query, option)
            return queryResult;
        }
        catch(error){
            throw new Error(error.errors[0].message)
        }
    }
}

module.exports = db