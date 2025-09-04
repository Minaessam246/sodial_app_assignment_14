"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const error_response_1 = require("../utils/response/error.response");
const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        for (const key of Object.keys(schema)) {
            const validator = schema[key];
            if (!validator)
                continue;
            const result = validator.safeParse(req[key]);
            if (!result.success) {
                validationErrors.push({
                    key: key.toString(),
                    issues: result.error.issues,
                });
            }
        }
        if (validationErrors.length > 0) {
            return next(new error_response_1.ApplicationError("Validation Error", 400, validationErrors));
        }
        return next();
    };
};
exports.validation = validation;
