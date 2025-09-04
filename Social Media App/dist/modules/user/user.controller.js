"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middelware_1 = require("../../middleware/authentication.middelware");
const user_services_1 = __importDefault(require("./user.services"));
const router = (0, express_1.Router)();
router.get("/profile", (0, authentication_middelware_1.authentication)(["System", "Bearer"], "access"), user_services_1.default.profile);
router.patch("/logout", (0, authentication_middelware_1.authentication)(["System", "Bearer"], "access"), user_services_1.default.logout);
router.post("/refresh-token", (0, authentication_middelware_1.authentication)(["System", "Bearer"], "refresh"), user_services_1.default.refreshToken);
exports.default = router;
