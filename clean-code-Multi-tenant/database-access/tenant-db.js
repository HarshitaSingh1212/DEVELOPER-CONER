module.exports = function createTenantDb(connection) {
    async function insertDataIntoTableTenats(data, CustomError) {
        const tenant_name = data.tenant_name;
        const userData = { tenant_name };
    
        const query = `
            INSERT INTO tenants SET ?
        `;
        try {
            const result = await connection.query(query, userData);
            console.log('Data inserted successfully');
            const query1 = `
                SELECT MAX(tenant_id) as tenant_id FROM tenants
            `;
            const [rows, fields] = await connection.query(query1);
            console.log(rows[0]);
            data.tenant_id = rows[0].tenant_id;
            console.log(data.tenant_id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new CustomError(409, "User already exists");
            } else {
                throw new CustomError(500, "Internal server error");
            }
        }
    }
    
    async function getTenantList(data, CustomError) {
        const employee_email = data.employee_email;
        const query = `SELECT tenant_id FROM employees WHERE employee_email = ?`;
        try {
            const [rows] = await connection.query(query, [employee_email]);
            console.log(rows);
            return rows;
        } catch (err) {
            throw new CustomError(500, "Internal Server Error");
        }
    }
    
    async function searchTenantName(data, CustomError) {
        const employee_email = data.employee_email;
        const query = `SELECT t.tenant_id, t.tenant_fullname FROM employees e LEFT JOIN tenants t ON e.tenant_id = t.tenant_id WHERE e.employee_email = ?`;
        try {
            const [rows] = await connection.query(query, [employee_email]);
            if (rows.length === 0) {
                throw new CustomError(404, "Tenant not found for the provided employee email");
            }
            return rows[0];
        } catch (err) {
            throw new CustomError(500, "Internal Server Error");
        }
    }
    
    return {
        insertDataIntoTableTenats,
        getTenantList,
        searchTenantName,

    }
}