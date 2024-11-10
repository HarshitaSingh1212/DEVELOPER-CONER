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


async function blogTitle(req,res){
   
        try {
          const title = req.params.title;
          console.log(title);
      
          // Query MySQL database to find the blog post by title
          const [blogData] = await connection.query('SELECT * FROM blogs WHERE title = ? AND status = ?', [title, 'published']);
      
          if (!blogData || blogData.length === 0) {
            console.log("error");
            return res.render('OopsNotPublished');
          }
      
          const blogPost = blogData[0];
      
          // Construct URLs for viewing and downloading attachments
          const linkview = "http://localhost:5000/getattachment/" + blogPost.attachment;
          const linkdownload = "http://localhost:5000/download/" + blogPost.attachment;
      
          res.render('blogPost', { blogPost, linkview, linkdownload });
        } catch (error) {
          console.error(error);
          res.render('error', { message: 'Internal server error' });
        }
     
      
}

module.exports = blogTitle;