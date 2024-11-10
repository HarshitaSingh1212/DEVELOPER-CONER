module.exports = function createUserDb(db){
    async function createUser(data){
        const queryResult = await db.query('INSERT INTO user (id, firstName, lastName, email, password, createdAt, modifiedAt, deletedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?);', {
            replacements: [data.id, data.firstName, data.lastName, data.email, data.password, data.createdAt, data.modifiedAt, data.deletedAt]
        })
        return queryResult;
    }
    
    async function findUserByEmail(email){
        const queryResult = await db.query('SELECT * FROM user WHERE email = ? AND deletedAt IS NULL;', {
            replacements: [email]
        })
    
        if (!queryResult.length || !queryResult[0].length) throw new Error('User does not exists.')
        return queryResult[0][0];
    }
    
    async function updateUserByEmail({ data, email }){
        const queryResult = await db.query('UPDATE user SET firstName = ?, lastName = ?, email = ?, password = ?, modifiedAt = ? WHERE email = ? AND deletedAt IS NULL;', {
            replacements: [data.firstName, data.lastName, data.email, data.password, data.modifiedAt, email]
        })
    
        if (!queryResult[0].affectedRows) throw new Error('User does not exists.')
    }
    
    async function softDeleteUserByEmail(email){
        const queryResult = await db.query('UPDATE user SET deletedAt = ? WHERE email = ? AND deletedAt IS NULL;', {
            replacements: [new Date(Date.now()), email]
        })
    
        if (!queryResult[0].affectedRows) throw new Error('User does not exists.')
    }
    
    return {
        createUser, findUserByEmail, updateUserByEmail, softDeleteUserByEmail
    }
}