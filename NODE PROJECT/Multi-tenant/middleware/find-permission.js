const connection = require("../utilities/database");

async function findPermission(req, res, validPermission) {
    const employee_id = req.body.id;
    const userData = [employee_id];
    const query = `SELECT permissions, tenant_id FROM employees WHERE employee_id = ? `;
    await connection.query(query, userData)
        .then(([rows, fields]) => {
            if (rows.length === 0) {
                res.statusCode = 404;
                res.end(JSON.stringify({
                    status: "FAILED",
                    msg: "Employee ID not found"
                }));
                return false;
            }
            console.log(rows);
            const permissionArray = rows[0].permissions;
            req.body.tenant_id = rows[0].tenant_id;
            if (!(permissionArray.includes("admin") || permissionArray.includes(validPermission))) {
                res.statusCode = 409;
                res.end(JSON.stringify({
                    status: "FAILED",
                    msg: "PERMISSION DENIED"
                }));
                return false;
            }
        })

        return true;
}

module.exports = findPermission;