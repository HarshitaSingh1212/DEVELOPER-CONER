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

    
    return connection;
  }
  catch(error){
  console.log("error", error);
  }
  
}main();

async function blogId(req,res){
    try{
        console.log("blogId")
        const [rows] = await connection.query('SELECT MAX(id) AS max_id FROM blogs');

        const maxId = rows[0].max_id;
        res.render('addhtml', { maxId: maxId });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    
}

module.exports = blogId;