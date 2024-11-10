class CustomError extends Error {
    constructor(status, msg) {
        super(msg); 
        this.name = this.constructor.name; 
        this.status = status; 
        this.msg = msg; 
        Error.captureStackTrace(this, this.constructor);
    }
}


module.exports = CustomError;