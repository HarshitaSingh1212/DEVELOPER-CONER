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

async function edit(req,res){
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
    
        // Retrieve the blog post by ID from the MySQL database
        const [blogData] = await connection.query('SELECT * FROM blogs WHERE id = ? AND user_id = ?', [blogId, userId]);
        if (!blogData || blogData.length === 0) {
          return res.status(404).json({ message: 'Blog not found' });
        }
    
        // Extract the blog post from the query result
        const blog = blogData[0];
    
        // Render the editBlog view with the retrieved blog post
        res.render('editBlog', { blog });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
} 

module.exports = edit;