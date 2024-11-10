const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require("body-parser");
const slugify = require('slugify');
const multer = require("multer");
const path = require("path");
// const sendEmail = require('./sendEmail');


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


const mongoURI = 'mongodb+srv://anonymousdemon2468:pXjVScZjLodMCbf1@cluster0.vyct6ja.mongodb.net/';

// Connect to MongoDB Atlas
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

// Define User schema
const UserSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  blogs: [{
    title: String,
    subtitle: String,
    editorContent: String,
    author: String,
    dateTime: String,
    modified_by: String,
    modified_at: String,
    created_by: String,
    created_at: String,
    attachment: String,
    status: String
  }]
});




const User = mongoose.model('User', UserSchema);

app.get('/', (req, res) => {
  res.render('login');

});

app.get('/signup', (req, res) => {
  res.render('signup');
});

// Middleware for session management
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Middleware to parse JSON bodies
app.use(express.json());


// Define a route to serve the home page

app.get('/addhtml', (req, res) => {
  res.render('addhtml');
});

app.get('/dash', (req, res) => {
  res.render('dash');
});



// Signup endpoint
app.post('/signup', async (req, res) => {
  console.log("hey")
  const { fullname, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({ fullname, email, password: hashedPassword });
    //-------------------------------------------------------------redirecting

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Store user information in session
    req.session.user = { id: user._id, email: user.email };
    //   res.json({ message: 'Login successful', user: req.session.user });
    res.redirect('/addhtml')
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});








const differenceInMilliseconds = 0;
app.post('/blog', upload.single("attachment"), async (req, res) => {
  try {
    // If user is not logged in, redirect to login page
    if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login page or appropriate route
    }

    const { title, subtitle, editorContent, author, date, time } = req.body;
    const attachment = req.file.path;

    const slug = slugify(title, { lower: true });
    console.log(editorContent);
    // Find the user who created the blog
    const dateTime = "" + date + "T" + time;
    let publishtime = dateTime;
    console.log(dateTime)
    const user = await User.findById(req.session.user.id);


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }



    const [datePart, timePart] = publishtime.split('T');

    const [year, month, day] = datePart.split('-').map(Number);


    const [hour, minute] = timePart.match(/\d{2}/g).map(Number); // Extract two digits for hour and minute


    publishtime = new Date(year, month - 1, day, hour, minute);

    status = "published";
    modified_at = publishtime;
    created_at = publishtime;
    modified_by = author;
    created_by = author;


    console.log("Difference in milliseconds:", differenceInMilliseconds);

    const newBlog = {
      title,
      subtitle,
      editorContent,
      author,
      dateTime,
      modified_by,
      modified_at,
      created_by,
      created_at,
      attachment,
      status
    };
    console.log(newBlog);
    user.blogs.push(newBlog);

    // Save the updated user document
    await user.save();

    // Redirect to the home page or render the home.ejs file with updated data
    res.render('blogs', { blogs: user.blogs }); // Render the home page after submitting the blog post
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.get("/pages", async (req, res) => {

  const user = await User.findById(req.session.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.render('pages', {
    blogs: user.blogs
  })
})




// app.get('/allBlogs', async (req, res) => {
//   try {

//     const users = await User.find({});


//     const allBlogs = users.flatMap(user => user.blogs);


//     res.render('allBlogs', { blogs: allBlogs });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });






app.get('/blog/:title', async (req, res) => {


  try {

    const title = req.params.title;


    const user = await User.findOne({ 'blogs.title': title });

    if (!user) {

      return res.render('error', { message: 'Blog post not found' });
    }


    const blogPost = user.blogs.find(blog => (blog.title === title && blog.status === "published"));

    if (!blogPost) {

      return res.render('error', { message: 'Blog post not found' });
    }


    res.render('blogPost', { blogPost });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Internal server error' });
  }


});

app.get('/pages', async (req, res) => {
  try {
    // Retrieve all users from MongoDB
    const users = await User.find({});

    // Extract blogs from all users
    const allBlogs = users.flatMap(user => user.blogs);

    // Render the 'blogs' view and pass the blogs data
    res.render('pages', { blogs: allBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





app.post('/delete/:blogId', async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Ensure user is logged in
    if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login page if user is not logged in
    }

    // Retrieve the user from MongoDB
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the blog with the given ID in the user's blogs array
    const blogIndex = user.blogs.findIndex(blog => blog._id.toString() === blogId);
    if (blogIndex === -1) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Remove the blog from the user's blogs array
    user.blogs.splice(blogIndex, 1);

    // Save the updated user document
    await user.save();

    // Redirect to the allBlogs page or any other appropriate page
    res.redirect('/allBlogs');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





app.get('/edit/:blogId', async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Ensure user is logged in
    if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login page if user is not logged in
    }

    // Retrieve the user from MongoDB
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the blog with the given ID from the user's blogs
    const blog = user.blogs.find(blog => blog._id.toString() === blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Render the 'editBlog' view and pass the blog data
    res.render('editBlog', { blog: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.post('/update/:blogId', async (req, res) => {
  try {
      const blogId = req.params.blogId;

      // Ensure user is logged in
      if (!req.session.user) {
          return res.redirect('/login'); // Redirect to login page if user is not logged in
      }

      // Retrieve the user who owns the blog
      const user = await User.findById(req.session.user.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Find the blog post to update
      const blogIndex = user.blogs.findIndex(blog => blog._id.toString() === blogId);
      if (blogIndex === -1) {
          return res.status(404).json({ message: 'Blog not found' });
      }

      // Update the blog post with the submitted data
      user.blogs[blogIndex].title = req.body.title;
      user.blogs[blogIndex].subtitle = req.body.subtitle;
      user.blogs[blogIndex].body = req.body.body;
      user.blogs[blogIndex].author = req.body.author;

      // Save the updated user document
      await user.save();

      // Redirect to the updated blog post or any other appropriate page
      res.redirect('/allBlogs');
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});








// Route to handle requests for individual blog posts based on their titles
// Route to handle requests for individual blog posts based on their titles
app.get('/blog/:title', async (req, res) => {
  try {
    // Extract the title from the URL parameters
    const title = req.params.title;

    // Find the user who owns the blog post
    const user = await User.findOne({ 'blogs.title': title });

    if (!user) {
      // If the user or blog post is not found, render an error page
      return res.render('error', { message: 'Blog post not found' });
    }

    // Find the blog post with the matching title
    const blogPost = user.blogs.find(blog => blog.title === title);

    if (!blogPost) {
      // If the blog post is not found, render an error page
      return res.render('error', { message: 'Blog post not found' });
    }

    // Render the blog post template with the blog post data
    res.render('blogPost', { blogPost });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});