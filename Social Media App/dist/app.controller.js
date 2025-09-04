"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)("./config/.env.development") });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const user_controller_1 = __importDefault(require("./modules/user/user.controller"));
const error_response_1 = require("./utils/response/error.response");
const connection_DB_1 = require("./DB/connection.DB");
const bootstrap = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.json());
    app.use("/auth", auth_controller_1.default);
    app.use("/user", user_controller_1.default);
    app.get("/", async (req, res, next) => {
        res.json("Hello from app controller");
    });
    app.use("{/*dummy}", async (req, res, next) => {
        res.status(404).json({ message: "not found route" });
    });
    app.use(error_response_1.errorHandler);
    (0, connection_DB_1.connectionn)();
    app.listen(3000, () => {
        console.log(`Server is running 🧨🧨🧨🧨 on ${process.env.PORT}`);
    });
};
exports.bootstrap = bootstrap;
