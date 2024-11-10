const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

async function generateToken(data) {
    const { employee_id, employee_email, tenant_id } = data;
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
    data.headers.cookie = '';
    const twoHoursInMillis = 2 * 60 * 60 * 1000;
    data.twoHoursInMillis = twoHoursInMillis;
    data.jwTtoken = token;
}

async function verifyToken(data) {
    let jwtToken;
    if (data.query.token) {
        jwtToken = data.query.token;
    }

    else if (data.headers.cookie) {
        const cookies = data.headers.cookie;
        const array = cookies.split('=');
        console.log(array)
        if(array.length === 1)
            jwtToken =  cookies
        else
        jwtToken = array[1].split(';')[0];

        if (data)
            data.token = jwtToken;
        console.log(jwtToken);
    }
    let flag = true;
    jwt.verify(jwtToken, secretKey, (err, decoded) => {
        if (err) {
            flag = false;
        } else {
            console.log("calll good")
            const { id, email, tenant_id } = decoded;
            if (!data)
                data = {};
           
                data.email = email;
                data.id = id;
                console.log("iddd:", id)
                if (!data.tenant_id)
                    data.tenant_id = tenant_id;
        }
    });
    return flag;
}


module.exports = { generateToken, verifyToken };


