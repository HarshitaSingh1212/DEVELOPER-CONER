const dotEnv = require('dotenv')
dotEnv.config({
    path: ['./config/server-config.env']
})

// creating routes
require('./router/user-router')

const { PORT } = process.env

const http = require('http')
const RestService = require('./utils/RestService')

const restService = new RestService()
const server = http.createServer(restService.init(true))

server.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`);
})