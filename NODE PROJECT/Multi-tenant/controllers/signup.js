const connection = require("../utilities/database");
const hashedPassword = require("../middleware/hash-password");
const sendEmail = require("../utilities/email");
const { generateToken, verifyToken } = require("../middleware/token");
const { v4: uuidv4 } = require('uuid');
const findPermission = require("../middleware/find-permission");

async function insertDataIntoTableTenats(req, res) {
    tenant_fullname = req.body.tenant_fullname;
    const userData = {tenant_fullname};

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
        req.body.tenant_id = rows[0].tenant_id;
        console.log(req.body.tenant_id);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('Error inserting data:', error);
            res.statusCode = 400;
            res.end(JSON.stringify({
                status: "error",
                msg: "User already exists"
            }));
        } else {
            console.error('Error inserting data:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: "error",
                msg: "Internal server error"
            }));
        }
    }
}


async function insertDataIntoTableEmployees(req, res) {
    const { employee_id, tenant_id, employee_name, employee_email, employee_status, employee_password, permissions } = req.body; 
    const userData = { employee_id, tenant_id, employee_name, employee_email, employee_status, employee_password, permissions };
    const query = `
        INSERT INTO employees SET ?
    `;
    try {
        await connection.query(query, userData);
        console.log('Data inserted successfully in employee');
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('Error inserting data:', error);
            res.statusCode = 400;
            res.end(JSON.stringify({
                status: "error",
                msg: "User already exists"
            }));
        } else {
            console.error('Error inserting data:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({
                status: "error",
                msg: "Internal server error"
            }));
        }
    }
}

async function generateEmployeeId(req, res, next) {
    const uuid = uuidv4();
    const employee_Id = uuid;
    req.body.employee_id = employee_Id;
}

async function insertIntoChannelTable(req, res) {
    const { tenant_id } = req.body;
    const query = "INSERT INTO channel (tenant_id, channel_code, channel_name) VALUES (?, ?, ?)";
    connection.query(query, [tenant_id, "en", "english"])
        .catch((error) => {
            console.error("Error inserting channel:", error);
            res.statusCode = 500;
            res.end(JSON.stringify({ 
                status: "error",
                error: "Internal server error." 
            }));
        });
}


async function signUp(req, res) {
    try {
        if (!req.body.employee_email || !req.body.employee_password || !req.body.employee_name || !req.body.tenant_fullname) {
            res.statusCode = 400;
            res.end(JSON.stringify({ 
                status: "error",
                msg: "Missing required fields. Please provide values for employee_email, employee_password, employee_name, and tenant_fullname." 
            }));
            
        }else{
            const arrPermission = ["admin"];
            req.body.permissions = JSON.stringify(arrPermission);
            req.body.employee_status = 'active';
            await generateEmployeeId(req, res);
            await insertDataIntoTableTenats(req, res);
            await hashedPassword(req, res);
            await insertDataIntoTableEmployees(req, res);
            await insertIntoChannelTable(req, res);
            await generateToken(req, res);
            res.statusCode = 200;
            res.end(JSON.stringify({
                status: "success",
                msg: "User signed up successfully"
            }));
        }
        
        
    } catch(err) {
        console.error('Error signing up:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "error",
            msg: "Internal server error"
        }));
    }
}


async function generateTokenForAddingUser(req) {
    const { employee_id, employee_email, tenant_id } = req.body;
    console.log(tenant_id);
    const payload = {
        id: employee_id,
        email: employee_email,
        tenant_id: tenant_id
    };
    const options = {
        expiresIn: '1h'
    };
    const token = jwt.sign(payload, secretKey, options);
    console.log(token);
    req.body.token = token;
}

async function addUsers(req, res) {
    try {
        if (!req.body.employee_email || !req.body.employee_name) {
            res.statusCode = 400;
            res.end(JSON.stringify({ 
                status: "error",
                msg: "Missing required fields. Please provide values for employee_email and employee_name" 
            }));
        }
        else{
            req.body.employee_status = 'Inactive';
            if(req.body.permission){
                const permission = req.body.permissions;
                req.body.permissions = JSON.stringify(permission);
            }
            else{
                const permission = ["read user","read product","read channel"]
                req.body.permissions = JSON.stringify(permission);
            }
            
            let flag = await verifyToken(req, res);
            if(flag){
               flag = await findPermission(req, res, "create user");
               if(flag){
                await generateEmployeeId(req, res);
                await generateTokenForAddingUser(req, res);
                await insertDataIntoTableEmployees(req, res);
                await sendEmail(req.body.employee_name, req.body.employee_email, req.body.token);
               }
            }
            
            res.statusCode = 200;
            res.end(JSON.stringify({
                status: "success",
                msg: "User created successfully"
            }));
        }
        
    
 } catch(err) {
        console.error('Error adding user:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({
            status: "error",
            msg: "Internal server error"
        }));
    }
}

module.exports = {
    signUp,
    addUsers
};