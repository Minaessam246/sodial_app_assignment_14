"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const user_model_1 = require("../DB/models/user.model");
const database_repository_1 = require("../DB/Repository/database.repository");
const token_security_1 = require("../utils/security/token.security");
const error_response_1 = require("../utils/response/error.response");
const token_model_1 = require("../DB/models/token.model");
const authentication = (allowed, tokenType) => {
    return async (req, res, next) => {
        const Ireq = req;
        const userr = new database_repository_1.DatabaseRepository(user_model_1.userModel);
        if (!req.headers?.authorization) {
            throw new error_response_1.ApplicationError("token is required ", 400);
            return res.json();
        }
        const { authorization } = req.headers;
        const [key] = authorization.split(" ");
        if (!allowed.includes(key)) {
            throw new error_response_1.ApplicationError("not authorized", 400);
        }
        try {
            var verification = JSON.stringify((0, token_security_1.decodeToken)({ authorization, tokenType, }));
            const user = await userr.findOne(JSON.parse(verification).email);
            console.log(verification);
            Ireq.user = user;
            Ireq.decoded = JSON.parse(verification);
            const x = JSON.parse(verification).jti;
            if (((user.changeCredentialTime?.getTime() || 0)) > JSON.parse(verification).iat * 1000) {
                throw new error_response_1.ApplicationError("logged out form all devices ", 400);
            }
            if (await token_model_1.tokenModel.findOne({ jti: x })) {
                throw new error_response_1.ApplicationError("logged out user or bad refresh token", 400);
            }
            next();
        }
        catch (error) {
            throw new error_response_1.ApplicationError("invalid token", 400);
        }
    };
};
exports.authentication = authentication;
