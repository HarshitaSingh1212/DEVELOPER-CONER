const mongoose = require('mongoose');

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
      modified_at: String,
      created_by: String,
      created_at: String,
      attachment: String,
      status: String
    }]
  });
  
  
  
  
  


module.exports = mongoose.model('User', UserSchema);
 
    
    // Define User schema
    