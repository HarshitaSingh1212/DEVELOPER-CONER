module.exports = function addUsersAsEmployee({
    verifyToken,
    findPermission,
    generateEmployeeId,
    generateTokenForAddingUser,
    addUserData,
    insertDataIntoTableEmployees,
    sendEmail,
    CustomError
}) {
    return async function addUsers(data) {
        try {
            if (!data.employee_email || !data.employee_name) {
                throw { status: 400, msg: "Missing datauired fields. Please provide values for employee_email and employee_name" };
             } else {
                data.employee_status = 'Inactive';
                if (data.permissions) {
                    const permission = data.permissions;
                    data.permissions = JSON.stringify(permission);
                } else {
                    const permission = ["read user", "read product", "read channel"];
                    data.permissions = JSON.stringify(permission);
                }
                const flag = await verifyToken(data);
                if(flag){
                    await findPermission(data,"create user",CustomError);
                    await generateEmployeeId(data);
                    await generateTokenForAddingUser(data);
                    const {employee_email,employee_name} = data;
                    await addUserData({employee_email,employee_name});
                    await insertDataIntoTableEmployees(data,CustomError);
                    await sendEmail(data.employee_name, data.employee_email, data.token);
                }
                else{
                    throw new CustomError(401,"invalid token")
                }
               
            }
        } catch (err) {
            throw err;
        }

    }

}