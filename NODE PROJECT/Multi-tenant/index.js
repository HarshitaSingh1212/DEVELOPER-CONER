const http = require("http");
require('dotenv').config();
const Router = require("./utilities/router");
const router = new Router();
const rest_service = require("./rest-service");
const service = new rest_service(router);
const serverCall = service.init();
const server = http.createServer(serverCall);
const port = process.env.PORT;
server.listen(port, () => {
    console.log("Server is running on port:", port);
});