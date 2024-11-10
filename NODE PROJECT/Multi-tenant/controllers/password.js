const hashedPassword = require("../middleware/hash-password");
const { verifyToken } = require("../middleware/token");
const connection = require("../utilities/database");


async function insertPasswordIntoEmployees(req, res) {
    const employee_id = req.body.id;
    const { employee_password } = req.body;
    const query = `UPDATE employees SET employee_password = ?, employee_status = ? WHERE employee_id = ?`;

    try {
        await connection.query(query, [employee_password,"active", employee_id]);
        res.statusCode =200;
        res.end('Password inserted into employees table successfully');
    } catch (error) {
        console.error('Error inserting password into employees table:', error);
        res.statusCode=500;
        res.send('Internal Server Error');
    }
}




async function searchTenantName(req,res){
    const employee_email = req.body.employee_email;
    const query = `SELECT t.tenant_id,t.tenant_fullname FROM employees e left join tenants t on e.tenant_id = t.tenant_id WHERE e.employee_email = ?`;
    try{
        const [rows] = await connection.query(query,[employee_email]);
        res.statusCode = 200;
        res.end(JSON.stringify(rows[0]));
    }
    catch(err){
        console.error('Error searching tenant name:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
    }

    }

async function findPassword(req,res){
    const tenant_id = req.body.tenant_id;
    const query = `SELECT employee_password FROM employees WHERE tenant_id = ?`;
    try{
        const [rows] = await connection.query(query,[tenant_id]);
        req.body.employee_password = rows[0].employee_password;
        res.statusCode = 200;
        res.end(JSON.stringify(rows[0]));
    }
    catch(err){
        console.error('Error finding password:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
    }
}
 
async function setPassword(req,res){
   let flag =  await verifyToken(req,res);
   if(flag){
    await hashedPassword(req,res);
    await insertPasswordIntoEmployees(req,res);
   }
}

 async function resetPassword(req, res) {
    try {
        let flag = await verifyToken(req, res);
        if(flag)
        await searchTenantName(req, res);
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}

async function setPasswordInTable(req, res) {
    try {
        await findPassword(req, res);
        await insertPasswordIntoEmployees(req, res);
    } catch (error) {
        console.error("Error in setPasswordInTable:", error);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "Failed",
            msg: 'Internal Server Error'
        }));
    }
}


module.exports = {
    setPassword,
    resetPassword,
    setPasswordInTable
};