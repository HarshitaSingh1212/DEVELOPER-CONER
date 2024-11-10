const jwt = require('jsonwebtoken');


const secretKey = 'your_secret_key';

async function generateToken(req, res, next) {
    const { employee_id, employee_email, tenant_id } = req.body;
    console.log(employee_id)
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
    req.headers.cookie = '';
    const twoHoursInMillis = 2 * 60 * 60 * 1000;
    res.setHeader('Set-Cookie', `jwtToken=${token}; Max-Age=${twoHoursInMillis}; Secure; Path=/; SameSite=None`);
}

async function verifyToken(req, res) {
    let jwtToken;
    if (req.query.token) {
        jwtToken = req.query.token;
    }

    else if (req.headers.cookie) {
        const cookies = req.headers.cookie;
        const array = cookies.split('=');
        console.log(array)
        if(array.length === 1)
            jwtToken =  cookies
        else
        jwtToken = array[1].split(';')[0];

        if (req.body)
            req.body.token = jwtToken;
        console.log(jwtToken);
    }

    jwt.verify(jwtToken, secretKey, (err, decoded) => {
        if (err) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "Invalid Token" }));
            return false;
        } else {
            const { id, email, tenant_id } = decoded;
            if (!req.body)
                req.body = {};
           
                req.body.email = email;
                req.body.id = id;
                console.log("iddd:", id)
                if (!req.body.tenant_id)
                    req.body.tenant_id = tenant_id;
        }
    });
    return true;
}


module.exports = { generateToken, verifyToken };


