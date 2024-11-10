const nodemailer = require("nodemailer");
require("dotenv").config();



async function sendEmail(name, email,token) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "choosehowyouwill996@gmail.com",
            pass: "XXXX",

        }
    });
    const mail = {

        from: {
            name: 'Harshita',
            address: "choosehowyouwill996@gmail.com"
        },
        to: email,
        subject: "Testing, testing, 123",
        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
     <h1>Hii ${name} </h1>
    <h3>set your password</h3>
        <h2>Please click the following link to set your password:</h2>
        <p><a href="http://localhost:5000/set-password?token=${token}">Set Password</a></p>
        <h2>if you already have password and you want to set it you can click on below link or else ignore it</h2>
        <p><a href="http://localhost:5000/reset-password?token=${token}">Reset Password</a></p>
</body>
</html>
        `,
    }

    const sendMail = async (transporter, mail) => {
        try {
            await transporter.sendMail(mail);
            console.log("email has been sent");
        } catch (err) {
            console.log(err);
        }
    }

    sendMail(transporter, mail);
}


module.exports = sendEmail;