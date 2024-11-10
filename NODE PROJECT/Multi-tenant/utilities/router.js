class Router {
    constructor() {
        this.getRoutes = {};
        this.postRoutes = {};
        this.putRoutes = {};
        this.deleteRoutes = {};
        this.patchRoutes = {};
    }

    _get(url, controllers, middleware = []) {
        this.getRoutes[url] = [controllers, ...middleware];
    }
    
    _post(url, controllers, middleware = []) {
        this.postRoutes[url] = [controllers, ...middleware];

    }

    _put(url, controllers, middleware = []) {
        this.putRoutes[url] = [controllers, ...middleware];

    }

    _delete(url, controllers, middleware = []) {
        this.deleteRoutes[url] = [controllers, ...middleware];

    }

    _patch(url, controllers, middleware = []) {
        this.patchRoutes[url] = [controllers, ...middleware];

    }
}

module.exports = Router;