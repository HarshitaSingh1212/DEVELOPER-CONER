const User = require('./UserSchema');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require("body-parser");
const slugify = require('slugify');
const multer = require("multer");
const path = require("path");
const cron = require('cron');
const nodemaile = require("nodemailer");
require("dotenv").config();
 
const sendEmail = require('./email');
const mysql = require('mysql2/promise');
let connection;
async function main(){
  try{
     connection = await mysql.createConnection({
      host: 'localhost',
      user: 'harshita',
      password: 'Harshita@123',
      database: 'RAPID_PROJECT',
      // connectionLimit: 10 // Adjust connection limit as needed
    });

    console.log("connected");
    return connection;
  }
  catch(error){
  console.log("error", error);
  }
  
}main();


async function update(req,res){
  


  try {
    const blogId = req.params.blogId;

    if (!req.session.user) {
      return res.redirect('/');
    }

    // Retrieve user ID from session
    const userId = req.session.user.id;

    // Check if the user exists
    const [userData] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the blog exists and belongs to the user
    const [blogData] = await connection.query('SELECT * FROM blogs WHERE id = ? AND user_id = ?', [blogId, userId]);
    if (!blogData || blogData.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Construct the SQL update query
    const updateQuery = `
      UPDATE blogs 
      SET title = ?, subtitle = ?, editorContent = ?, author = ?, modified_at = ? 
      WHERE id = ? AND user_id = ?
    `;

    // Get current datetime
    const modifiedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Execute the update query
    await connection.query(updateQuery, [
      req.body.title.trim(),
      req.body.subtitle,
      req.body.editorContent,
      req.body.author,
      modifiedAt,
      blogId,
      userId
    ]);
    const date = req.body.date;
    const time = req.body.time;
    if (date !== '' && time !== '') {
      const publishTime = new Date(date + 'T' + time);
    
      const publishJob = new cron.CronJob('* * * * *', async () => {
        const currentTime = new Date();
        if (currentTime >= publishTime) {
          await connection.query(
            'UPDATE blogs SET status = "published" WHERE id = ? AND user_id = ?',
            [blogId, userId]
          );
          publishJob.stop(); 
        }
      });
      publishJob.start();
    }

    
    const emailJob = new cron.CronJob('*/5 * * * *', () => {
      // Check if it's time to send the email notification
      // You can implement your logic here to send the email
    });
    emailJob.start();

    res.redirect('/allBlogs');
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }


}


module.exports = update;