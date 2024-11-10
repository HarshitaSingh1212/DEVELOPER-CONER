const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require("body-parser");
const slugify = require('slugify');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


const mongoURI = 'mongodb+srv://dixitdevershi:774NWV4PIALxfvWK@cluster0.hgkwsoo.mongodb.net/';

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
  username: String,
  password: String,
  blogs: [{
    title: String,
    subtitle: String,
    body: String,
    author: String,
     
  }]
});



const User = mongoose.model('User', UserSchema);

app.get('/', (req, res) => {
    res.render('index');
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

app.get('/', (req, res) => {
  res.render('home');
});



// Signup endpoint
app.post('/signup', async (req, res) => {

  const { username, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({ username, password: hashedPassword });
   
    res.render('home');
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Store user information in session
    req.session.user = { id: user._id, username: user.username };
     res.render('home');
  
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




// Create blog endpoint
// Create blog endpoint
// Create blog endpoint


app.post('/blog', async (req, res) => {
  try {
    // If user is not logged in, redirect to login page
    if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login page or appropriate route
    }

    const { title, subtitle, body, author } = req.body;

    const slug = slugify(title, { lower: true });

    // Find the user who created the blog
    const user = await User.findById(req.session.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the new blog post to the user's blogs array
    const newBlog = {
      title,
      subtitle,
      body,
      author,
      slug
    };

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















app.get('/allBlogs', async (req, res) => {
  try {
    // Retrieve all users from MongoDB
    const users = await User.find({});

    // Extract blogs from all users
    const allBlogs = users.flatMap(user => user.blogs);

    // Render the 'blogs' view and pass the blogs data
    res.render('allBlogs', { blogs: allBlogs });
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
    res.render('error', { message: 'Internal server error' });
  }
});






  


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

