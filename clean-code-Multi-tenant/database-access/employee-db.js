const crypto = require("crypto");
module.exports = function createEmployeeDb(connection) {
    async function insertDataIntoTableEmployees(data, CustomError) {
        const { employee_id, tenant_id, employee_name, employee_email, employee_status, employee_password, permissions } = data; 
        const userData = { employee_id, tenant_id, employee_name, employee_email, employee_status, employee_password, permissions };
        const query = `
            INSERT INTO employees SET ?
        `;
        try {
            await connection.query(query, userData);
            console.log('Data inserted successfully in employee');
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new CustomError(409, "User already exists");
            } else {
                throw new CustomError(500, "Internal server error");
            }
        }
    }
    
    async function updateEmployeeFields(data, CustomError) {
        const employee_Id = data.param.employeeId;
        const { employee_status, employee_name, permissions } = data;
        const values = [];
        let query = `UPDATE employees SET `;
     
        if (employee_name) {
            query += `employee_name = ?, `;
            values.push(employee_name);
        }
        if (employee_status) {
            query += `employee_status = ?, `;
            values.push(employee_status);
        }
        
        if (permissions) {
            query += `permissions = ?, `;
            values.push(JSON.stringify(permissions));
        }
        console.log(query);
        query = query.slice(0, -2);
        console.log(employee_Id)
        query += ` WHERE employee_id = ?`;
        values.push(employee_Id);
        
        try {
            await connection.query(query, values);
        } catch (error) {
            console.log(error)
            throw new CustomError(500, 'Internal Server Error');
        }
    }
    
    async function deleteEmployeeInEmployees(data, CustomError) {
        try{
            const employee_Id = data.param.employeeId;
            const query1 = `SELECT employee_id FROM employees WHERE employee_id = ?`;
            await connection.query(query1,[employee_Id])
            .then(([rows])=>{
               if(rows.length === 0){
                throw new CustomError(404,"Employee Id not found");
               }
            })
            const query = `DELETE FROM employees WHERE employee_Id = ?`;
        
            try {
                await connection.query(query, [employee_Id]);
                const query2 = `SELECT tenant_id FROM employees WHERE tenant_id = ?`
                const tenant_id = data.tenant_id;
                await connection.query(query2,[tenant_id])
                .then(async (rows)=>{
                    if(rows[0].length===0){
                        const query3 = `DELETE FROM tenants WHERE tenant_id = ?`;
                        await connection.query(query3,[tenant_id]);   
                    }
                })
            } catch (error) {
                throw error
            }
        }
        catch(err){
            throw err;
        }
       
    }
    

    async function checkCredentials(data, CustomError) {
        const { employee_email, employee_password, tenant_id } = data;
        console.log(employee_email, employee_password,tenant_id);
        const query = `
           SELECT employee_password, employee_id
           FROM employees
           WHERE employee_email = ? AND tenant_id = ?
       `;
    
        try {
            const [results] = await connection.query(query, [employee_email, tenant_id]);
    
            if (results.length === 0) {
                console.log(employee_email, tenant_id)
                throw new CustomError(400, 'Invalid email or tenant ID');
            } else if (results[0].employee_password) {
                const [salt, key] = results[0].employee_password.split(':');
                const hashedBuffer = crypto.pbkdf2Sync(employee_password, salt, 100000, 64, 'sha512');
                const keyBuffer = Buffer.from(key, 'hex');
                const match = crypto.timingSafeEqual(hashedBuffer, keyBuffer);
                if (!match) {
                    throw new CustomError(401, 'Incorrect password');
                }
                data.employee_id = results[0].employee_id;
            } else {
                throw new CustomError(404, 'Password not set');
            }
    
            return true;
        } catch (err) {
            throw err
        }
    }
    
    async function insertPasswordIntoEmployees(data, CustomError) {
        const employee_id = data.id;
        const { employee_password } = data;
        const query = `UPDATE employees SET employee_password = ?, employee_status = ? WHERE employee_id = ?`;
    
        try {
            await connection.query(query, [employee_password, "active", employee_id]);
        } catch (error) {
            throw new CustomError(500, 'Internal Server Error');
        }
    }
    
    async function findPassword(data, CustomError) {
        const tenant_id = data.tenant_id;
        const query = `SELECT employee_password FROM employees WHERE tenant_id = ?`;
        try {
            const [rows] = await connection.query(query, [tenant_id]);
            if (rows.length === 0) {
                throw new CustomError(404, 'Password not found for the provided tenant ID');
            }
            data.employee_password = rows[0].employee_password;
            return rows[0];
        } catch (err) {
            throw new CustomError(500, 'Internal Server Error');
        }
    }
    
    async function findPermission(data, validPermission, CustomError) {
        const employee_id = data.id;
        const userData = [employee_id];
        const query = `SELECT permissions, tenant_id FROM employees WHERE employee_id = ?`;
        try {
            const [rows, fields] = await connection.query(query, userData);
            if (rows.length === 0) {
                throw new CustomError(404, "Employee ID not found");
            }
            const permissionArray = rows[0].permissions;
            data.tenant_id = rows[0].tenant_id;
            if (!(permissionArray.includes("admin") || permissionArray.includes(validPermission))) {
                throw new CustomError(403, "Permission denied for this operation.");
            }
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
    
    return {
     insertDataIntoTableEmployees, 
     updateEmployeeFields,
     deleteEmployeeInEmployees,
     checkCredentials,
     insertPasswordIntoEmployees,
     findPassword,
     findPermission
    }
}