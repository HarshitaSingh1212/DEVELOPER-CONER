module.exports = function createMakeUser({ generateId, validateData, createHash }){
    return async function makeUser({
        id,
        firstName,
        lastName,
        email,
        password,
        createdAt = new Date(Date.now()),
        modifiedAt = new Date(Date.now()),
        deletedAt = null
    }){
        id = id ?? await generateId()
        
        const userData = { id, firstName, lastName, email, password, createdAt, modifiedAt, deletedAt }
        await validateData(userData)
        userData.password = await createHash(password)

        return userData;
    }
}