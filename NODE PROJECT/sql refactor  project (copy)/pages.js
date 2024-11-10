const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const session = require('express-session');
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

async function pages(req,res){
    console.log("entered")
    const [userData] = await connection.query('SELECT * FROM users WHERE id = ?', [req.session.user.id]);
    if (userData.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
    const [blog] = await connection.query('SELECT * FROM blogs WHERE user_id = ?', [req.session.user.id]);
    res.render('pages', {
        blogs: blog
      });
}

module.exports = pages;