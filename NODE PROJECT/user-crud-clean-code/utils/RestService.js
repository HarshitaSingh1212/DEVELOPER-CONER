const formidable = require("formidable");
const { Router } = require("./Router");
const response = require("../constants/response");
const logger = require("../constants/logger");
const url = require("url");

class RestService {
  init(createQueryObject) {
    return async (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, *");
      res.setHeader('Access-Control-Allow-Credentials', 'true')

      try {
        const methodRoutes = Router.methodMap[req.method];
        if (!methodRoutes) {
          res.statusCode = 404;

          response.error(
            {
              constant: logger.error_constants.ROUTE_NOT_FOUND,
            },
            res
          );
          return;
        }

        const routePathList = Object.keys(methodRoutes);

        const { path, params } = this.getPath(req.url, routePathList);

        console.log(`[?] Path found at ${path}`);

        if (!path) {
          res.statusCode = 404;

          response.error(
            {
              constant: logger.error_constants.ROUTE_NOT_FOUND,
            },
            res
          );
          return;
        }

        const parsedQuery = url.parse(req.url);
        req.query = this.getQueries(parsedQuery.search, createQueryObject);
        req.pathname = parsedQuery.pathname;
        req.path = parsedQuery.path;
        req.param = params;

        if (req.method !== "get" || req.method !== "GET") {
          req.body = await this.getData(req, res);

          if (req.body === null) {
            res.statusCode = 400;
            const payload = response.error(
              {
                data:
                  req.headers["content-type"] ?? req.headers["Content-Type"],
                constant: logger.error_constants.INVALID_DATA_FORMAT,
              },
              res
            );

            return;
          }
        }

        console.log("query", req.query);
        console.log("pathname", req.pathname);
        console.log("path", req.path);
        console.log("param", params);
        console.log("body", req.body);
        console.log();
        console.log();

        const handlerList = methodRoutes[path];

        for (let handler of handlerList) {
          try {
            await handler(req, res);
          }
          catch (error) {
            return;
          }
        }
      } catch (error) {
        res.statusCode = 500;
        response.error(
          {
            data: error.message,
            constant: logger.error_constants.INTERNAL_SERVER_ERROR,
          },
          res
        );
      }
    };
  }

  getPath(url, routePathList) {
    const immediateRouteIndex = routePathList.indexOf(url);
    if (!url.includes(":") && immediateRouteIndex !== -1) {
      return {
        path: routePathList[immediateRouteIndex],
        params: {},
      };
    }

    if (url.includes("?")) {
      url = url.slice(0, url.indexOf("?"));
    }

    const sub_urlPath = url.split("/").slice(1);

    for (let routePath of routePathList) {
      const sub_routePath = routePath.split("/").slice(1);

      if (sub_urlPath.length !== sub_routePath.length) continue;

      let isPathValid = true;
      const paramData = {};
      sub_urlPath.forEach((path, index) => {
        if (
          (path !== sub_routePath[index] &&
            !sub_routePath[index].includes(":")) ||
          (!path && sub_routePath[index].includes(":"))
        ) {
          isPathValid = false;
          return;
        } else if (sub_routePath[index].includes(":")) {
          paramData[sub_routePath[index].replace(":", "")] = path;
        }
      });

      if (isPathValid) {
        return {
          path: routePath,
          params: paramData,
        };
      }
    }
    return {
      path: undefined,
      params: {},
    };
  }

  getQueries(url, createObject) {
    const queryObj = {};

    if (!url) return;

    if (createObject) {
      const query = url.slice(url.indexOf("?") + 1);
      const fieldsList = query.split("&");

      for (let field of fieldsList) {
        try {
          const [key, value] = field.split("=");
          queryObj[key] = value;
        } catch {
          continue;
        }
      }

      return queryObj;
    } else {
      const query = url.slice(url.indexOf("?") + 1);
      return query;
    }
  }

  async getData(req, res) {
    const contentType =
      req.headers["content-type"] ?? req.headers["Content-Type"];
    if (!contentType) return "";

    let body = "";

    try {
      if (
        contentType.startsWith("application/json") ||
        contentType.startsWith("text/json")
      ) {
        body = await this.processJSON(req);
      } else if (
        contentType.startsWith("multipart/form-data") ||
        contentType.startsWith("application/x-www-form-urlencoded")
      ) {
        body = await this.processForm(req);
      } else if (contentType === "text/plain") {
        body = await this.processText(req);
      }
    } catch (error) {
      return null;
    }

    return body;
  }

  processJSON(req) {
    return new Promise((resolve, reject) => {
      const body = [];

      req.on("data", (chunk) => {
        body.push(chunk);
      });
      req.on("end", () => {
        if (body.length) {
          try {
            resolve(JSON.parse(body.toString()));
          } catch (error) {
            reject(error.message);
          }
        } else {
          resolve("");
        }
      });
      req.on("error", (error) => {
        reject(error);
      });
    });
  }

  processForm(req) {
    return new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm({
        multiples: true,
      });

      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        }

        resolve({
          fields,
          files,
        });
      });
    });
  }

  processText(req) {
    return new Promise((resolve, reject) => {
      let body = [];

      req.on("data", (chunk) => {
        body.push(chunk);
      });
      req.on("end", () => {
        if (body.length) {
          resolve(Buffer.from(...body).toString());
        } else {
          resolve("");
        }
      });
      req.on("error", (error) => {
        reject(error);
      });
    });
  }
}

module.exports = RestService;
