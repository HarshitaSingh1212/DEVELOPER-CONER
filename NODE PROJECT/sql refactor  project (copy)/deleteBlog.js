const bcrypt = require('bcrypt');
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



async function deleteBlog(req,res){
    console.log("delete");
  
    try {
      const blogId = req.params.blogId;
  
      if (!req.session.user) {
        return res.redirect('/login'); 
      }
  
      // Retrieve user ID from session
      const userId = req.session.user.id;
      console.log(userId)
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
  
      // Perform deletion operation in the database
      await connection.query('DELETE FROM blogs WHERE id = ?', [blogId]);
  
      // Redirect to the pages route after successful deletion
      res.redirect('/pages');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }

  
      
}

module.exports = deleteBlog;