const crypto = require("crypto");

async function hashedPassword(req,res){
    const formData = req.body;
    const password = formData.employee_password;
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex'); 
    const hashPassword =  `${salt}:${hashedPassword}`;
    req.body.employee_password = hashPassword;
}



module.exports = hashedPassword;