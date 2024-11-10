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

const mysql = require('mysql2/promise');
const job = require('./email');
let connection;
async function main() {
  try {
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
  catch (error) {
    console.log("error", error);
  }

} main();

//-------------------------------------------->
async function bloginput(req, res) {
  try {

    if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login page or appropriate route
    }

    const { save_input, title, subtitle, editorContent, author, date, time } = req.body;
    console.log(req.body);

    let status = save_input === "1" ? "draft" : "scheduled";

    const attachment = req.file.path;

    let publish_time = null;

    if (date && time) {
      const dateTime = `${date}T${time}`;
      publish_time = new Date(dateTime);
      publish_time = publish_time.toISOString().split('T')[0];
    }

     newBlog = {
      title,
      subtitle,
      editorContent,
      author,
      dateTime: publish_time,
      modified_at: "no modification yet",
      created_by: author,
      created_at: new Date(),
      attachment,
      status
    };
    console.log(newBlog);
   
    const [userData] = await connection.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
     use = userData[0];
    if (!use) {
      return res.status(404).json({ message: 'User not found' });
    }

    const insertBlogQuery = 'INSERT INTO blogs (user_id, title, subtitle, editorContent, author, dateTime, modified_at, created_by, created_at, attachment, status,publish_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
    const blogValues = [use.id, newBlog.title, newBlog.subtitle, newBlog.editorContent, newBlog.author, newBlog.dateTime, newBlog.modified_at, newBlog.created_by, newBlog.created_at, newBlog.attachment, newBlog.status,publish_time];
    const [result] = await connection.query(insertBlogQuery, blogValues);

     blogId = result.insertId;

    if (status === "scheduled") {
      console.log("in cron")
      let jobifi = new cron.CronJob("* * * * *", async () => {
        job();
       console.log("done ok");
      });

      jobifi.start();
     
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = bloginput;