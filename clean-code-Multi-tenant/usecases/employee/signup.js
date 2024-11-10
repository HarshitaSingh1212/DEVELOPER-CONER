module.exports = function signUpTenant({
    generateEmployeeId,
    insertDataIntoTableTenats,
    hashedPassword,
    signUpData,
    insertDataIntoTableEmployees,
    insertIntoChannelTable,
    generateToken,
    CustomError
}
) {
    return async function signUp(data) {
        try {
            if (!data.employee_email || !data.employee_password || !data.employee_name || !data.tenant_name) {
                throw new CustomError(400, "Missing required fields. Please provide values for employee_email, employee_password, employee_name, and tenant_fullname.");

            } else {
                const arrPermission = ["admin"];
                data.permissions = JSON.stringify(arrPermission);
                data.employee_status = 'active';
                await generateEmployeeId(data);
                const {tenant_name, employee_name,employee_password,employee_email} = data;
                await signUpData({tenant_name, employee_name,employee_password,employee_email});
                await insertDataIntoTableTenats(data,CustomError);
                await hashedPassword(data,CustomError);
                await insertDataIntoTableEmployees(data,CustomError);
                await insertIntoChannelTable(data,CustomError);
                await generateToken(data);
                return data;
            }
        } catch (err) {
            throw err;
        }
    }
}
