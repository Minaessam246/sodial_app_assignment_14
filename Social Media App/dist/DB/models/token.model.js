"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenModel = void 0;
const mongoose_1 = require("mongoose");
exports.tokenModel = (0, mongoose_1.model)("token", new mongoose_1.Schema({
    jti: String,
    expiresIn: Number,
    userID: { type: mongoose_1.Schema.Types.ObjectId, ref: "user" }
}));
