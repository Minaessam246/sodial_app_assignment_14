"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("./../../utils/response/error.response");
const user_model_1 = require("../../DB/models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nanoid_1 = require("nanoid");
const email_event_1 = require("../../utils/events/email.event");
const database_repository_1 = require("../../DB/Repository/database.repository");
const user_repository_1 = require("./../../DB/Repository/user.repository");
const token_security_1 = require("../../utils/security/token.security");
const google_auth_library_1 = require("google-auth-library");
class AuthenticationService {
    constructor() {
    }
    userModel = new user_repository_1.UserRepository(user_model_1.userModel);
    findUser = new database_repository_1.DatabaseRepository(user_model_1.userModel);
    verifyEmail = async (idToken) => {
        const client = new google_auth_library_1.OAuth2Client();
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: "765880014065-git1shsdmpt5akdla32mu5bsvebdevpb.apps.googleusercontent.com",
            });
            var payload = ticket.getPayload();
        }
        catch (e) {
            throw new error_response_1.ApplicationError("invalid id token", 400);
        }
        if (!payload) {
            throw new error_response_1.ApplicationError("invalid id token ", 400);
        }
        return payload;
    };
    loginGmail = async (req, res) => {
        const { idToken } = req.body;
        const { email } = await this.verifyEmail(idToken);
        const user = await this.userModel.findOne({ filter: { email } });
        const credentials = (0, token_security_1.getLoginCredentials)(user);
        if (user) {
            return res.json({ message: "logged in", credentials });
        }
        else {
            throw new error_response_1.ApplicationError("not registered user", 400);
        }
    };
    signupGmail = async (req, res) => {
        const { idToken } = req.body;
        const { email, family_name, given_name } = await this.verifyEmail(idToken);
        const user = await this.userModel.findOne({ filter: { email } });
        if (user) {
            if (user.provider == "SYSTEM") {
                throw new error_response_1.ApplicationError("Registered without using Google", 400);
            }
            else if (user.provider == "GOOGLE") {
                this.loginGmail(req, res);
            }
        }
        else {
            var created = await this.userModel.create({ data: [{ email, username: (given_name + family_name), provider: "GOOGLE" }] });
            if (created) {
                return res.status(201).json({ message: "created", created });
            }
            else {
                throw new error_response_1.ApplicationError("signup error", 400);
            }
        }
    };
    signup = async (req, res) => {
        const { username, password, email, role } = req.body;
        const check = await this.findUser.findOne({ filter: { email } });
        if (check) {
            throw new error_response_1.ApplicationError("email exists", 409);
        }
        const custom = (0, nanoid_1.customAlphabet)("1234567890", 5);
        const sentOtp = custom();
        console.log(sentOtp);
        const subject = "confirmation email";
        email_event_1.emailEvent.emit("sendEmail", { email, sentOtp, subject });
        const otp = bcrypt_1.default.hashSync(sentOtp, 10);
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await this.userModel.createUser({ data: [{ username, password: hashedPassword, email, otp, role }], options: { validateBeforeSave: true } });
        if (user) {
            return res.status(201).json({ message: "signedup", data: { username, password, email } });
        }
        return res.status(500).json({ message: "can't sign up" });
    };
    verifyForgetCode = async (req, res) => {
        const { email, otp } = req.body;
        const user = await user_model_1.userModel.findOne({ email });
        if (!user || !user.resetPasswordOtp || !bcrypt_1.default.compareSync(otp, user?.resetPasswordOtp)) {
            throw new error_response_1.ApplicationError('Invalid email or OTP', 400);
        }
        return res.status(200).json({ message: 'otp confirmed successfully ' });
    };
    resetPassword = async (req, res) => {
        const { email, otp, newPassword } = req.body;
        const user = await user_model_1.userModel.findOne({ email });
        if (!user || !user.resetPasswordOtp || !bcrypt_1.default.compareSync(otp, user?.resetPasswordOtp)) {
            throw new error_response_1.ApplicationError('Invalid email or OTP', 400);
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        const updated = await this.userModel.updateOne({ filter: { email }, update: { password: hashedPassword } });
        if (updated.modifiedCount) {
            return res.status(201).json({ message: "password reset " });
        }
        throw new error_response_1.ApplicationError("can't reset password", 500);
    };
    sendForgetCode = async (req, res) => {
        const { email } = req.body;
        const custom = (0, nanoid_1.customAlphabet)("1234567890", 5);
        const sentOtp = custom();
        console.log(sentOtp);
        const subject = "Reset Password email";
        email_event_1.emailEvent.emit("sendEmail", { email, sentOtp, subject });
        const otp = bcrypt_1.default.hashSync(sentOtp, 10);
        if (await this.userModel.findOne({ filter: { email } })) {
            const updated = await this.userModel.updateOne({ filter: { email }, update: { resetPasswordOtp: otp } });
            if (updated.modifiedCount) {
                return res.status(201).json({ message: "otp sent " });
            }
        }
        throw new error_response_1.ApplicationError("not registered user", 400);
    };
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const user = await user_model_1.userModel.findOne({ email });
        if (!user || !user.otp || !bcrypt_1.default.compareSync(otp, user?.otp)) {
            throw new error_response_1.ApplicationError('Invalid email or OTP', 400);
        }
        if (user?.confirmEmail) {
            return res.status(200).json({ message: 'Email already confirmed' });
        }
        await user_model_1.userModel.updateOne({ email }, { confirmEmail: true });
        return res.status(200).json({ message: 'Email confirmed' });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await user_model_1.userModel.findOne({ email });
        if (!user || !bcrypt_1.default.compareSync(password, user.password)) {
            throw new error_response_1.ApplicationError('Invalid email or password or email not confirmed', 400);
        }
        console.log(user);
        const credentials = (0, token_security_1.getLoginCredentials)(user);
        return res.status(200).json({ message: "Logged in successfully", credentials });
    };
}
exports.default = new AuthenticationService();
