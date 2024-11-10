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

require("dotenv").config();
 
const sendEmail = require('./email');

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, `${req.session.user.id}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const app = express();




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//----------CREATING MONGOSE CONNECTION------------------------------------------>

  const mongoURI = 'mongodb+srv://anonymousdemon2468:pXjVScZjLodMCbf1@cluster0.vyct6ja.mongodb.net/';

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB Atlas:', err.message);
    });


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


app.post('/signup', async (req, res) => {
  console.log("hey")
  const { fullname, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ fullname, email, password: hashedPassword });

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
 
  const { email, password } = req.body;
  
  try {
    console.log(User);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    req.session.user = { id: user._id, email: user.email };
   
    res.redirect('/dash')
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login')
});


//-----------------TAKING INPUT IN ADDHTML----------------------------->

app.get('/addhtml', (req, res) => {
  res.render('addhtml');
});

app.get('/dash', (req, res) => {
  res.render('dash');
});

app.post('/blog', upload.single("attachment"), async (req, res) => {
  bloginput(req,res);
  res.redirect('/pages'); // Render the home page after submitting the blog post

});

app.get('/home',(req,res)=>{
  res.render('home');
})



//---------------------------User Pages --------------------------------->
app.get("/pages", async (req, res) => {

  const user = await User.findById(req.session.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.render('pages', {
    blogs: user.blogs
  })
})



//----------------------------AllBLogs---------------------------------------->
app.get('/allBlogs', async (req, res) => {
  try {
   
    const users = await User.find({});
 
    
    let allBlogs = users.flatMap(user => user.blogs);
 
   
    allBlogs = allBlogs.filter(blog => blog.status === 'published');
 
   
    res.render('allBlogs', { blogs: allBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//------------------------------blogTitle------------------------->


app.get("/getattachment/uploads/:fileName", (req, res) => {
  const fileName = req.params.fileName;

  console.log(fileName);
  res.sendFile(fileName, {
    root: path.join(__dirname, "uploads"),
  });
});
 
app.get("/download/uploads/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  console.log(fileName);
  res.download(path.join(__dirname, "uploads", fileName));
});

app.get('/pages', async (req, res) => {
  try {
   
    const users = await User.find({});

  
    const allBlogs = users.flatMap(user => user.blogs);

    
    res.render('pages', { blogs: allBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//----------------------------------------deletePages------------------------>

app.post('/delete/:blogId', async (req, res) => {
  try {
    const blogId = req.params.blogId;

    if (!req.session.user) {
      return res.redirect('/login'); 
    }

    
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const blogIndex = user.blogs.findIndex(blog => blog._id.toString() === blogId);
    if (blogIndex === -1) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    
    user.blogs.splice(blogIndex, 1);

  
    await user.save();
   res.redirect('/pages');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//----------------------------------------------get BLog using it's url----------------------->
app.get('/blog/:title', async (req, res) => {
  try {
                   
    const title = req.params.title;
    console.log(title);

    const user = await User.findOne({ 'blogs.title': title });
   
   console.log(user)  

    if (!user) {

      console.log("error")
    }
  
    const blogPost = user.blogs.find(blog => (blog.title === title && blog.status==="published"));
     
    if (!blogPost) {
       res.render('OopsNotPublished')
    }
     
     
    const linkview = "http://localhost:3000/getattachment/" +blogPost.attachment;
    const linkdownload = "http://localhost:3000/download/" +blogPost.attachment;
   
    
    res.render('blogPost', { blogPost,linkview,linkdownload });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Internal server error' });
  }

});

//-------------------------------------EDIT PAGE------------------------------>

app.get('/edit/:blogId', async (req, res) => {
  try {
    const blogId = req.params.blogId;

    
    if (!req.session.user) {
      return res.redirect('/login'); 
    }

    
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const blog = user.blogs.find(blog => blog._id.toString() === blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

   
    res.render('editBlog', { blog: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//----------------------UPDATING BLOG---------------------------------->
app.post('/update/:blogId', async (req, res) => {
  try {
      const blogId = req.params.blogId;

      
      if (!req.session.user) {
          return res.redirect('/login');
      }

      
      const user = await User.findById(req.session.user.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      
      const blogIndex = user.blogs.findIndex(blog => blog._id.toString() === blogId);
      if (blogIndex === -1) {
          return res.status(404).json({ message: 'Blog not found' });
      }

     
      user.blogs[blogIndex].title = req.body.title.trim();
      user.blogs[blogIndex].subtitle = req.body.subtitle;
      user.blogs[blogIndex].editorContent = req.body.editorContent;
      user.blogs[blogIndex].author = req.body.author;
      let date = new Date(); 
      let string_date = date+"";
      string_date = string_date.split(' G')[0];
      user.blogs[blogIndex].modified_at = string_date;
      

      date = req.body.date;
      time =req.body.time;

      console.log(date, time);

      if(date!=='' && time!==''){
        
        dateTime = "" + date + "T" + time;

        let publish_time = dateTime;

        let [datePart, timePart] = publish_time.split('T');
    
        let [year, month, day] = datePart.split('-').map(Number);
    
    
        let [hour, minute] = timePart.match(/\d{2}/g).map(Number); 
    
    
        publish_time = new Date(year, month - 1, day, hour, minute);
        
        console.log(publish_time)

        user.blogs[blogIndex].status = "scheduled";
        let check = false;
        let check_email = false;

        let job = new cron.CronJob("* * * * *", async () => {

          let temp_time = new Date();
          let diff = publish_time - temp_time;
          console.log("entered");
          if(diff<=0 && !check){
            await User.findOneAndUpdate(
              { _id: req.session.user.id, "blogs.title": req.body.title },
              { $set: { "blogs.$.status": "published" } }
            );
            check = true;
            console.log("done");
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
     
      await user.save();

      
      res.redirect('/allBlogs');
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

//----------------------------------Schedule and draft page---------------->

app.get('/addhtml/blog/:title',async (req,res)=>{
  try {
                   
    const title = req.params.title;
    console.log(title);

    const user = await User.findOne({ 'blogs.title': title });
   
   console.log(user)  

    if (!user) {

      console.log("error")
    }
  
    const blogPost = user.blogs.find(blog => (blog.title === title ));
     
    if (!blogPost) {

     console.log("error");
    }
    res.render('preview', { blogPost});
  }
  catch (error) {
    console.error(error);
    res.render('error', { message: 'Internal server error' });
  }
})


//---------------------Running at 3000--------------------->

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});