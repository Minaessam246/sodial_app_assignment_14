"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.RoleEnum = void 0;
const mongoose_1 = require("mongoose");
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["user"] = "user";
    RoleEnum["admin"] = "admin";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
exports.userModel = (0, mongoose_1.model)("users", new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    role: { type: String, enum: Object.values(RoleEnum), default: RoleEnum.user },
    otp: { type: String, required: false },
    resetPasswordOtp: { type: String, required: false },
    confirmEmail: { type: Boolean, default: false },
    changeCredentialTime: { type: Date, required: false },
    provider: { type: String, default: "SYSTEM" },
}));
