const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const User = require('./UserSchema');
const bloginput = require('./bloginput');
const cron = require('cron');

const main = require('./node');

require("dotenv").config();
const mysql = require('mysql2/promise');
const signup = require('./signup');
const login = require('./login');
const pages = require('./pages');
const blogTitle = require('./blogTitle');
const deleteBlog = require('./deleteBlog');
const preview = require('./preview');
const edit = require('./edit');
const update = require('./update');
const allBlogs = require('./allblogs');
const blogId = require('./blogId');
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, `${req.session.user.id}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const app = express();

app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static('public'));

//----------------------------MYSQL CONNECTION------------------------------------>

// $(document).ready(function() {
//   $.ajax({
//       url: '/', 
//       type: 'GET',
//       success: function(response) {
//           $('#loginContainer').html(response); 
//       },
//       error: function(xhr, status, error) {
//           console.error(error);
//       }
//   });
// });


//----------------------RENDERING LOGIN AND SIGNUP PAGE----------------------->
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});


app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000 // 1 hour in milliseconds
  }

}));


app.use(express.json());
console.log("hey")


app.post('/signup', async (req, res) => {
  signup(req, res);
});

app.post('/login', async (req, res) => {
  login(req, res);
});


app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login')
});


//-----------------TAKING INPUT IN ADDHTML----------------------------->

app.get('/addhtml', async (req, res) => {
   blogId(req,res);
});
//-------------------------------------------------------------------------------?
app.get('/dash', (req, res) => {
  res.render('dash');
});

app.post('/blog', upload.single("attachment"), async (req, res) => {
  bloginput(req, res);
  res.redirect('/pages'); // Render the home page after submitting the blog post

});

app.get('/home', (req, res) => {
  res.render('home');
})



//---------------------------User Pages --------------------------------->
app.get("/pages", async (req, res) => {
  pages(req, res);
})



// //----------------------------AllBLogs---------------------------------------->
app.get('/allBlogs', async (req, res) => {
  allBlogs(req, res);
});

// //------------------------------blogTitle------------------------->


app.get("/getattachment/uploads/:fileName", (req, res) => {
  try {
    const fileName = req.params.fileName;

    console.log(fileName);
    res.sendFile(fileName, {
      root: path.join(__dirname, "uploads"),
    });
  }
  catch (error) {
    console.log(error);
  }
});
//-------------------------------------------------------------------------> 
app.get("/download/uploads/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  console.log(fileName);
  res.download(path.join(__dirname, "uploads", fileName));
});

//------------------------------------------------------------------------------->
// app.get('/pages', async (req, res) => {
//   try {

//     const users = await User.find({});


//     const allBlogs = users.flatMap(user => user.blogs);


//     res.render('pages', { blogs: allBlogs });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });



// //----------------------------------------deletePages------------------------>

app.post('/delete/:blogId', async (req, res) => {
  deleteBlog(req, res);
});
// //----------------------------------------------get BLog using it's url----------------------->
app.get('/blog/:title', async (req, res) => {
  blogTitle(req, res);
});

// //-------------------------------------EDIT PAGE------------------------------>


app.get('/edit/:blogId', async (req, res) => {
  edit(req, res);
});



// //----------------------UPDATING BLOG---------------------------------->
app.post('/update/:blogId', async (req, res) => {
  update(req, res);
});

// //----------------------------------Schedule and draft page---------------->

app.get('/addhtml/blog/:title', async (req, res) => {
  preview(req, res);
});


// //---------------------Running at 3000--------------------->

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//----------------------------------------------------------->

console.log("hello from app");