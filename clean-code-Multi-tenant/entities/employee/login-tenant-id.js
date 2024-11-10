module.exports = function validateLoginTenantIdData(validateData){
    return async function loginTenantId({
       tenant_id
    }){
        const data = {tenant_id}

        try{
            await validateData(data);
        }
        catch(err){
            throw err;
        }
    }
};