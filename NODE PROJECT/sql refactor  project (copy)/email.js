const nodemailer = require("nodemailer");
const mysql = require('mysql2/promise');

require("dotenv").config();

async function job() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'harshita',
      password: 'Harshita@123',
      database: 'RAPID_PROJECT',
     
    });

    const currentDate = new Date().toISOString().split('T')[0];

    // Update the status of blogs whose publish time is in the past
    try {
      const updateStatusQuery = `
        UPDATE blogs 
        SET status = 'published' 
        WHERE publish_time IS NOT NULL 
        AND publish_time < NOW() AND status = 'scheduled';
      `;
      await connection.query(updateStatusQuery);
    } catch (error) {
      console.error("Error updating blog statuses:", error);
    }

    // Fetch blogs scheduled to be published within the next hour and send emails
    try {
      const oneHourLater = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      const blogsToNotify = await connection.query(
        `SELECT b.*, u.email 
         FROM blogs b 
         INNER JOIN users u ON b.user_id = u.id 
         WHERE b.publish_time IS NOT NULL 
         AND b.publish_time <= ? 
         AND b.email_sent = false`,
        [oneHourLater]
      );

      for (const blog of blogsToNotify[0]) {
        await sendEmail(blog.fullname, blog.title, blog.publish_time, blog.email);
        console.log('Email sent successfully for blog:', blog.id);

        
        await connection.query(
          'UPDATE blogs SET email_sent = true WHERE id = ?',
          [blog.id]
        );
      }
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  } catch (error) {
    console.log("Error:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function sendEmail(name, title, dates, email) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Usually true if connecting to port 465
    auth: {
      user: "choosehowyouwill996@gmail.com", // Your email address
      pass: "xxxx", // Password (for gmail, your app password)
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
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bootstrap demo</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
      </head>
      <body>
        <h1 id="rapid-heading" class="text-center mt-5 mb-5">Rapid Page Builder</h1>
        <div class="div1">
          <div class="border border-3 form-container p-3 m-4">
            <h2 class="mt-3">Good Morning, ${name}</h2>
            <form style="font-weight: 300; font-size: 14px;">
              <p class="fw-bold">Pages publishing today</p>
              <div class="border-bottom">
                <p class="fw-light"><span>${title}</span><span>${dates}</span></p>
                <p style="background-color: rgb(211, 231, 239);">if you ignore this message you can't change your password</p>
              </div>
              <!-- Other content -->
            </form>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mail);
    console.log("Email has been sent to", email);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

module.exports = job;
