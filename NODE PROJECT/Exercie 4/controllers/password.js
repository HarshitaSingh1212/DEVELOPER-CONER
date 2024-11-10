const hashedPassword = require("../middleware/hash-password");
const { generateToken, verifyToken } = require("../middleware/token");
const connection = require("../utilities/database");

async function insertPasswordIntoEmployees(req, res) {
    const employee_id = req.body.id;
    console.log(employee_id);
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


async function setPassword(req,res){
   console.log(req.query.token);
   console.log(req.headers.cookie);
   await verifyToken(req,res);
   await hashedPassword(req,res);
   await insertPasswordIntoEmployees(req,res);
}

function resetPassword(req,res){
    verifyToken(req,res);
    insertPasswordIntoEmployees(req,res);
}

module.exports = {setPassword};