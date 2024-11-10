const crypto = require("crypto");
const fs = require("fs");
const {join} = require("path");
let databasePath = join(__dirname,"database.json");

if (!fs.existsSync(databasePath)) {
    let arr = [];
    fs.writeFileSync(databasePath,JSON.stringify(arr));
}

//HASH + SALT  LOGIN AND SIGNUP FUNCTION------------------>

const data = fs.readFileSync(databasePath,'utf8');
const users = JSON.parse(data);


function signup(username,password){
const checkname = users.find(v => v.username===username) 
if(checkname){
    return "user already exist";
}
const salt = crypto.randomBytes(16).toString('hex');
const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex'); 
const user = {username:`${username}`, password: `${salt}:${hashedPassword}`};
users.push(user);
fs.writeFileSync(databasePath,JSON.stringify(users));
return "Congratulations! Sign up complete";
}

function login(username,password){
    const user = users.find(v => v.username===username);
    if(!user){
        return "user not found";
    }
    const[salt,key] = user.password.split(':');
    const hashedBuffer = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');

    const keyBuffer = Buffer.from(key, 'hex');
    const match = crypto.timingSafeEqual(hashedBuffer, keyBuffer);

    if(match){
        return `Welcome ${username}`;
    }
    else{
        return 'login fail! check your password'
    }
}

function myPage(action,username,password){
    if(action === "login"){
        console.log(login(username,password));
    }
    else if(action === "signup"){
        console.log(signup(username,password));
    }
}

myPage("signup","harshita","hey1");
myPage("login","harshita","hey1");
myPage("login","poorva","hey2");
myPage("signup","poorva","hey2");

