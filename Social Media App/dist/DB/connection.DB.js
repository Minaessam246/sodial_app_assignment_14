"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionn = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectionn = async () => {
    try {
        await mongoose_1.default.connect("mongodb://localhost:27017/social_app");
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Can't connect to MongoDB", error);
    }
};
exports.connectionn = connectionn;
