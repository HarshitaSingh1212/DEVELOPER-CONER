const { registerUser, loginUser, updateUser, deleteUser } = require('../controller/user-controller')
const { Router } = require('../utils/Router')

const router = new Router('user')
router._post('/register', registerUser)
router._post('/login', loginUser)
router._post('/update', updateUser)
router._post('/delete', deleteUser)