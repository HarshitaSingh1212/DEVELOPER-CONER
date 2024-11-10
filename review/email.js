const nodemaile = require("nodemailer");
require("dotenv").config();
 
 

//   function sendEmail(){
    let transporter = nodemaile.createTransport({
        service:'gmail',
    host: "smtp.gmail.com",
    
        port: 587,
        secure: false, // Usually true if connecting to port 465
        auth: {
          user:"choosehowyouwill996@gmail.com", // Your email address
          pass: "XXXX", // Password (for gmail, your app password)
         
        }
      });
      console.log("hey");
      // Define and send message inside transporter.sendEmail() and await info about send from promise:
      const mail = {
        
        from: {
            name: 'Harshita',
            address:"choosehowyouwill996@gmail.com"
        },
        to:"anonymousdemon2468@gmail.com",
        subject: "Testing, testing, 123",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
           
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Bootstrap demo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
             
        
        </head>
        <body>
            <h1 id="rapid-heading" class="text-center mt-5 mb-5">Rapid Page Builder</h1>
            <div class="div1">
                <div class="border border-3 form-container p-3 m-4">
                    <h2 class="mt-3">Good Morning,john</h2>
                    <form style="font-weight: 300; font-size: 14px;">
                        <p class="fw-bold">Pages publishing today</p>
                        <div class="border-bottom">
                            <p class="fw-light"><span>Demo Records</span><span>Dates</span></p>
                            <p style="background-color: rgb(211, 231, 239);">if you ignore this message you can't change your password</p>
                        </div>
                        <div class="border-bottom">
                            <p class="fw-light"><span>Demo Records</span><span>Dates</span></p>
                            <p style="background-color: rgb(211, 231, 239);">if you ignore this message you can't change your password</p>
                        </div> 
                        <div class="border-bottom">
                            <p class="fw-light"><span>Demo Records</span><span>Dates</span></p>
                            <p style="background-color: rgb(211, 231, 239);">if you ignore this message you can't change your password</p>
                        </div>
                        <div class="images d-flex justify-content-center align-items-center">
                            <img src="icons/facebook.svg" alt="" srcset="">
                            <img src="icons/linkdlen.svg" alt="" srcset="">
                            <img src="icons/Instagram.svg" alt="" srcset="">
                            <img src="icons/youtube.svg" alt="" srcset="">
                            <img src="icons/brand.svg" alt="" srcset="">
                        </div>
                        <div class="d-flex justify-content-center align-items-center">
                            <small class="fw-light">501 Satyamev Eminence, Ahemdabad, GJ 12345</small>
                        </div>
                    </form>
        
                </div>
               
            </div>
            <div class="d-flex justify-content-center align-items-center mt-4">
                <small class="fw-light">you are receiving this email at <a href="#">example@domain.com</a> because you opted in</small>
            </div>
            <div class="d-flex justify-content-center align-items-center mt-4">
                <small class="fw-light p-3 text-center">if you no longer wish to receive communication
                     from us please <a href="#">unsubscribe</a> or <a href="#">unpdate</a>
                     your communication prefrence</small>
            </div>
        </body>
        </html>
        `,
      }
     
    const sendMail = async (transporter, mail)=>{
        try{
         await transporter.sendMail(mail);
         console.log("email has been sent")
        }catch(err){
          console.log(err);
        }
    }
     
    sendMail(transporter,mail);

    console.log("done");
//   }


//   module.exports = sendEmail;