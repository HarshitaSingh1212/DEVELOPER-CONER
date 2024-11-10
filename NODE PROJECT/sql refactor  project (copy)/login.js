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

async function login(req,res){
    const { email, password } = req.body;
  
    try {
     
      const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
  
      
      if (existingUser.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, existingUser[0].password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      req.session.user = { id: existingUser[0].id, email: existingUser[0].email };
     
      res.redirect('/dash');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
}
console.log("hello from loign");
module.exports = login;