const crypto = require("crypto");
const { verifyToken, generateToken } = require("../middleware/token");
const connection = require("../utilities/database.js");


async function getTenantList(req, res) {
    const employee_email = req.body.employee_email;
    const query = `SELECT tenant_id FROM employees WHERE employee_email = ?`;
    await connection.query(query, [employee_email])
        .then(([rows]) => {
            console.log("after")
            res.statusCode = 200;
            res.end(JSON.stringify(rows));
        })
        .catch((err) => {
            console.log("LOGIN ERROR", err);
            res.end("ERROR");
        })

}


async function login(req, res) {
    try {
        await generateToken(req, res);
        await getTenantList(req, res);
    }
    catch (err) {
        res.statusCode = 500;
        res.end("Internal server error");
    }

}

async function getTenantPassword(req, res) {
    try {
        let flag = verifyToken(req, res);
        if(flag){
            req.body.employee_email = req.body.email;
            generateToken(req, res);
            res.statusCode = 200;
            res.end("enter password for the tenant");
        }
        
    }
    catch (err) {
        res.statusCode = 500;
        res.end("Internal server error");
    }

}


async function checkCredentials(req, res) {
    const { employee_email, employee_password, tenant_id } = req.body;

    const query = `
       SELECT employee_password,employee_id
       FROM employees
       WHERE employee_email = ? AND tenant_id = ?
   `;

    await connection.query(query, [employee_email, tenant_id])
        .then(([results]) => {
            if (results.length === 0) {
                res.statusCode = 401;
                res.end('Invalid email or tenant ID');
                return false;
            }
            else if (results[0].employee_password) {
                const [salt, key] = results[0].employee_password.split(':');
                const hashedBuffer = crypto.pbkdf2Sync(employee_password, salt, 100000, 64, 'sha512');
                const keyBuffer = Buffer.from(key, 'hex');
                const match = crypto.timingSafeEqual(hashedBuffer, keyBuffer);
                if (match) {
                    req.body.employee_id = results[0].employee_id;
                }
                else {
                    res.statusCode = 401;
                    res.end('Incorrect password');
                    return false;
                }
            }
            else {
                res.statusCode = 401;
                res.end('Password not set');
                return false;
            }
        })
        .catch((err) => {
            console.error('Error executing SQL query:', err);
            res.statusCode = 500;
            res.end('Internal server error');
        });

        return true;
}


async function getPassword(req, res) {
    try {
        let flag = await verifyToken(req, res);
        if (flag) {
            req.body.employee_email = req.body.email;
            req.body.employee_id = req.body.id;
            flag = await checkCredentials(req, res);
            if (flag) {
                await generateToken(req, res);
                res.statusCode = 200;
                res.end('Login successful');
            }

        }
    }
    catch (err) {
            res.statusCode = 500;
            res.end("Internal server error");
        }

    }


        module.exports = {
        login,
        getTenantPassword,
        getPassword
    };