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

async function signup(req,res){
  const { fullname, email, password } = req.body;
  try {
    const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUser[0].length>0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newData = ({ fullname, email, password: hashedPassword });
  
    const [result] = await connection.query('INSERT INTO users SET ?', newData);
   
   
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = signup