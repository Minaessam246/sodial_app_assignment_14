"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    statusCode;
    constructor(message, statusCode, cause) {
        super(message, { cause });
        this.statusCode = statusCode;
    }
}
exports.ApplicationError = ApplicationError;
const errorHandler = (error, req, res, next) => {
    return res.status(error.statusCode).json({ Error: error.message, cause: error.cause });
};
exports.errorHandler = errorHandler;
