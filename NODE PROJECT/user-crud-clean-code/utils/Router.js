class Router{
    static getRoutes = {}
    static postRoutes = {}
    static deleteRoutes = {}
    static patchRoutes = {}
    static optionRoutes = {}
    static putRoutes = {}

    static methodMap = {
        'get': Router.getRoutes,
        'post': Router.postRoutes,
        'delete': Router.deleteRoutes,
        'patch': Router.patchRoutes,
        'put': Router.putRoutes,

        'OPTIONS': Router.optionRoutes,
        'GET': Router.getRoutes,
        'POST': Router.postRoutes,
        'DELETE': Router.deleteRoutes,
        'PATCH': Router.patchRoutes,
        'PUT': Router.putRoutes
    }

    constructor(root){
        this.root = root
    }

    getActualPath(path){
        if (this.root === '/' || !this.root){
            return path
        }
        return `/${this.root}${path}`
    }

    addOptions(path){
        this._options(path, (req, res) => res.end())
    }

    _get(path, handler, ...middlewares){
        const actualPath = this.getActualPath(path)
        Router.getRoutes[actualPath] = [...middlewares, handler]
    }
    _options(path, handler, ...middlewares){
        const actualPath = this.getActualPath(path)
        Router.optionRoutes[actualPath] = [...middlewares, handler]
    }
    _post(path, handler, ...middlewares){        
        const actualPath = this.getActualPath(path)
        this.addOptions(path)
        Router.postRoutes[actualPath] = [...middlewares, handler]
    }
    _delete(path, handler, ...middlewares){
        const actualPath = this.getActualPath(path)
        Router.deleteRoutes[actualPath] = [...middlewares, handler]
    }
    _patch(path, handler, ...middlewares){
        const actualPath = this.getActualPath(path)
        Router.patchRoutes[actualPath] = [...middlewares, handler]
    }
    _put(path, handler, ...middlewares){
        const actualPath = this.getActualPath(path)
        Router.putRoutes[actualPath] = [...middlewares, handler]
    }
}

module.exports = {
    Router
}