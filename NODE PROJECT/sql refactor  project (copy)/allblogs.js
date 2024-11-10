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


async function allBlogs(req,res){
    const [rows] = await connection.query(
        'SELECT * FROM blogs WHERE status = ?',
        ['published']
      );

      res.render('allBlogs', { blogs: rows });
}


module.exports = allBlogs;