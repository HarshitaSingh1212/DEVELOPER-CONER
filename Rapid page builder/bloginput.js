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


async function bloginput(req,res){
    try {
   
        if (!req.session.user) {
          return res.redirect('/login'); // Redirect to login page or appropriate route
        }
    
        const { save_input, title, subtitle, editorContent, author, date, time } = req.body;
        console.log(req.body);
        status = "scheduled";
        if(save_input === "1")
         status = "draft"
        const attachment = req.file.path;
    
        const slug = slugify(title, { lower: true });
       
        let dateTime = "" + date + "T" + time;

        let publish_time = dateTime

        const user = await User.findById(req.session.user.id);
    
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        if(date!==''&& time!=''){
          const [datePart, timePart] = publish_time.split('T');
    
          const [year, month, day] = datePart.split('-').map(Number);
      
      
          const [hour, minute] = timePart.match(/\d{2}/g).map(Number); // Extract two digits for hour and minute
      
      
          publish_time = new Date(year, month - 1, day, hour, minute);
        }
       
       
       
        let currdate = new Date(); 
      let string_date = currdate+"";
      string_date = string_date.split(' G')[0];
    
         console.log(save_input);
        modified_at = "no modification yet";
        created_at = string_date;
        created_by = author;
        
      
    
    
        const newBlog = {
          title,
          subtitle,
          editorContent,
          author,
          dateTime,
          modified_at,
          created_by,
          created_at,
          attachment,
          status
        };
        console.log(newBlog);
        user.blogs.push(newBlog);
        
       
        await user.save();
        let check = false;
        let check_email = false;


        if(status === "scheduled"){
          
          let job = new cron.CronJob("* * * * *", async () => {
            let temp_time = new Date();
            let diff = publish_time - temp_time;
            console.log("entered");
            if(diff<=0 && !check){
              await User.findOneAndUpdate(
                { _id: req.session.user.id, "blogs.dateTime": dateTime },
                { $set: { "blogs.$.status": "published" } }
              );
              console.log("done");
              check = true;
            }
          
        });
        job.start(); 
      
          let emailjob = new cron.CronJob("* * * * *",()=>{
            let temp_time = new Date();
            let diff = publish_time - temp_time;
            if(diff<=3600000 && !check_email){
              sendEmail(user.fullname,user.blogs.title,publish_time);
              check_email = true;
            }
          })
    
          emailjob.start();
        
       
    
        }
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
         
          
        }
        
  

module.exports = bloginput;