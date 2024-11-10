const setPasswordOfEmployee = require('./set-password');
const {setPassword} = require('../../usecases/index');

const setPasswordInEmployee = setPasswordOfEmployee(setPassword)

module.exports = {
    setPasswordInEmployee
}