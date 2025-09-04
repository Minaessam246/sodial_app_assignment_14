"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = require("../../DB/Repository/user.repository");
const user_model_1 = require("../../DB/models/user.model");
const token_model_1 = require("../../DB/models/token.model");
const token_repository_1 = require("./../../DB/Repository/token.repository");
const token_security_1 = require("../../utils/security/token.security");
class userServices {
    userModel = new user_repository_1.UserRepository(user_model_1.userModel);
    tokenModel = new token_repository_1.TokenRepository(token_model_1.tokenModel);
    constructor() { }
    profile = async (req, res, next) => {
        const Ireq = req;
        return res.json({ message: "profile", user: Ireq.user });
    };
    refreshToken = async (req, res) => {
        const Ireq = req;
        const { email, _id } = Ireq.user;
        const { jti } = Ireq.decoded;
        const user = await user_model_1.userModel.findOne({ email });
        console.log(user);
        const credentials = (0, token_security_1.getLoginCredentials)(user);
        await this.tokenModel.create({ data: [{ jti, userID: _id }] });
        return res.status(200).json({ message: "login renewed", credentials });
    };
    logout = async (req, res, next) => {
        const Ireq = req;
        const { flag } = req.body;
        const { _id } = Ireq.user;
        const { jti, iat } = Ireq.decoded;
        const update = {};
        switch (flag) {
            case "all":
                await user_model_1.userModel.updateOne({ _id, changeCredentialTime: Date.now() });
                break;
            case "only":
                await this.tokenModel.create({ data: [{ jti, userID: _id }] });
                break;
            default:
                break;
        }
        ;
        return res.json({ message: "done" });
    };
}
exports.default = new userServices();
