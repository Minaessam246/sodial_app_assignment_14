"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_sevices_1 = __importDefault(require("./auth.sevices"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const validators = __importStar(require("./auth.validation"));
const router = (0, express_1.Router)();
router.get("/signup", (0, validation_middleware_1.validation)(validators.signup), auth_sevices_1.default.signup);
router.get("/login", (0, validation_middleware_1.validation)(validators.login), auth_sevices_1.default.login);
router.post("/signup-gmail", auth_sevices_1.default.signupGmail);
router.post("/login-gmail", auth_sevices_1.default.loginGmail);
router.post("/send-forgetPassword-code", auth_sevices_1.default.sendForgetCode);
router.post("/verify-forgetPassword-code", auth_sevices_1.default.verifyForgetCode);
router.patch("/resetPassword", auth_sevices_1.default.resetPassword);
router.get("/confirmEmail", auth_sevices_1.default.confirmEmail);
exports.default = router;
