"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEmail(email, otp, subject) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "minaessam1810@gmail.com",
            pass: "vgqu hlet ocfl omql",
        },
    });
    (async () => {
        const info = await transporter.sendMail({
            from: `Social App`,
            to: email,
            subject,
            text: `confirmation otp ${otp}`,
        });
        console.log(info.messageId);
    })();
}
