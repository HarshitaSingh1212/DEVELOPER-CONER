const url = require("url");
const formidable = require("formidable");
const {setPasswordInEmployee} = require("./controller/set-password/index");
const { signUpForTenant,addUsersInTenant, deleteEmployeeInTenant, updateEmployeeInTenant, getTenantPasswordOfTenant,getPasswordOfTenant, loginInTenant } = require("./controller/employee/index");
const { createProductInTenant,updateProductInTenant, deleteProductFromTenant, readAllProductInTenant, readProductByIdInTenant } = require("./controller/product/index");
const { createChannelInTenant,updateChannelInTenant, deleteChannelIntenant, readAllChannelInTenant, readChannelByIdInTenant } = require("./controller/channel/index");

// const forgotPassword = require("./controllers/forgot-password");
class Rest_service {
    constructor(router) {
        this.router = router;
    }

    async executeApi(req, res, routerMapping) {
        const parsedUrl = url.parse(req.url, true);
         req.parsedUrl = parsedUrl;
        const { pathname, query } = parsedUrl;
         req.query = query;
         req.pathname = pathname;
        req.body = await this.getRequestBody(req);
        const path = this.getURL(req, routerMapping,pathname);
        const methods = routerMapping[path];
        if (!methods) {
           res.statusCode = 404;
           res.end("Route Not Found");
        }
        else{
            console.log("enterer")
            methods[0](req, res);
        }
           
    }


    getURL(req, routerMapping, pathname) {
        let array = pathname.split('/');
        const keysArray = Object.keys(routerMapping);
        if (array.length === 0) return "/";
        let str = "";
        let obj = {};
        for (let i = 0; i < keysArray.length; i++) {
            const splitPath = keysArray[i].split('/');
            if (splitPath.length === array.length) {
                let match = true;
                for (let j = 0; j < splitPath.length; j++) {
                    if (splitPath[j] !== array[j] && !(splitPath[j].includes(':') && array[j])) {
                        match = false;
                        break;
                    }
                    else if (splitPath[j].includes(':') && array[j]) {
                        let temp = splitPath[j].substring(1);
                        let temp1 = array[j];
                        console.log(array[j])
                        if(+temp1===NaN){
                            obj[temp] = +array[j];
                        }
                        else
                        obj[temp] = array[j];
                    }
                }
                if (match) {
                    str = keysArray[i];
                    break;
                }
            }
        }
      
        req.param = obj;
        console.log(req.param)
        return str;
    }


    async getRequestBody(req) {
        const content = req.headers['Content-Type'] || req.headers['content-type'];
        if (content) {
            if (content === 'application/json' || content === 'text/plain') {
                return await this.getJsonData(req);
            }
            else if (content.includes('multipart/form-data')) {
                return await this.getMultipartFormData(req);
            }
            else if (content === 'application/x-www-form-urlencoded') {
                return await this.getUrlEncodedData(req);
            }
        }
        else {
            return;
        }


    }

    async getJsonData(req) {
        return new Promise((resolve, reject) => {
            let data = [];
            req.on('data', (ch) => {
                data.push(ch);
            });

            req.on('end', () => {
                let d = Buffer.concat(data).toString();
                let jsonData;
                try {
                    jsonData = JSON.parse(d);
                } catch (err) {
                    reject(err);
                    return;
                }
                resolve(jsonData);
            });

            req.on('error', (err) => {
                reject(err);
            });
        });
    }


    async getMultipartFormData(req) {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();

            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                let formData = {};
                for (let key in fields) {
                    formData[key] = fields[key][0] ?? fields[key][0];
                }
                let formFile = {};
                for (let key in files) {
                    for (let val of files[key]) {
                        if (val.filepath) {
                            formFile[key] = [val.filepath, val.mimetype.split("/")[1] ?? val.mimetype.split("/")[1]];
                        }
                    }

                }
                req.files = formFile;
                resolve({ formData });
            });
        });
    }

    async  getUrlEncodedData(req) {
        return new Promise((resolve, reject) => {
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                const parsedData = parseUrlEncodedData(data);
                resolve(parsedData);
            });
            req.on('error', (error) => {
                reject(error);
            });
        });
    }
    
     parseUrlEncodedData(data) {
        const parsedData = {};
        const keyValuePairs = data.split('&');
        keyValuePairs.forEach((pair) => {
            const [key, value] = pair.split('=');
            parsedData[decodeURIComponent(key)] = decodeURIComponent(value);
        });
        return parsedData;
    }
    
    

    init() {
        this.userRoutes();
        this.productRoutes();
        this.channelRoutes();
          
        return async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5502')
            res.setHeader('Access-Control-Allow-Method', 'POST,PUT,DELETE,PATCH,GET')
            res.setHeader('Access-Control-Allow-Headers','Content-Type, *')
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            if(req.method == 'OPTIONS'){
                res.writeHead(200);
                res.end();
                return;
            }

            switch (req.method.toUpperCase()) {
                case 'GET':
                    await this.executeApi(req, res, this.router.getRoutes);
                    break;

                case 'POST':
                    await this.executeApi(req, res, this.router.postRoutes);
                    break;

                case 'PUT':
                    await this.executeApi(req, res, this.router.putRoutes);
                    break;

               case 'PATCH':
                        await this.executeApi(req, res, this.router.patchRoutes);
                        break;    

                case 'DELETE':
                    await this.executeApi(req, res, this.router.deleteRoutes);
                    break;

                default:
                   res.end("okkk")
            }
        }


    }



    userRoutes() {
        this.router._post("/signup", signUpForTenant);
        this.router._post("/addusers", addUsersInTenant);
        this.router._post("/login",loginInTenant);
        this.router._post("/get-tenant",getTenantPasswordOfTenant);
        this.router._post("/get-tenant/password",getPasswordOfTenant);
        this.router._post("/set-password",setPasswordInEmployee);
        this.router._post("/reset-password",setPasswordInEmployee);
        this.router._patch("/employee/:employeeId",updateEmployeeInTenant);
        this.router._delete("/employee/:employeeId",deleteEmployeeInTenant);
    }

    productRoutes() {
        this.router._post("/product",createProductInTenant);
        this.router._post("/product/:productId/:channelCode",createProductInTenant);
        this.router._patch("/product/:productId/:channelCode",updateProductInTenant);
        this.router._delete("/product/:productId",deleteProductFromTenant);
        this.router._delete("/product/:productId/:channelCode",deleteProductFromTenant);
        this.router._get("/product",readAllProductInTenant);
        this.router._get("/product/:productId",readProductByIdInTenant);
        this.router._get("/product/:productId/:channelCode",readProductByIdInTenant);
    }

    channelRoutes() {
        this.router._post("/channel",createChannelInTenant);
        this.router._patch("/channel/:channelId",updateChannelInTenant);
        this.router._delete("/channel/:channelId",deleteChannelIntenant);
        this.router._get("/channel",readAllChannelInTenant);
        this.router._get("/channel/:channelId",readChannelByIdInTenant);
    }

}


module.exports = Rest_service;

