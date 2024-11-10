const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require("body-parser");
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware for session management
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// MongoDB Connection
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

// Define User schema
const UserSchema = new mongoose.Schema({
  fullname:String,
  email: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

// Routes
console.log("all good")
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});
console.log("all good till here")
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/views/signup.html");
});
console.log("all good till here")
// Signup endpoint
app.post('/signup', async (req, res) => {
  console.log("hey")
  const { fullname,email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await User.create({ fullname,email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully' });
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
    res.json({ message: 'Login successful', user: req.session.user });
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




const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
