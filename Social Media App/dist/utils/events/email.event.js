"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const stream_1 = require("stream");
const sendEmail_1 = require("./../email/sendEmail");
exports.emailEvent = new stream_1.EventEmitter();
exports.emailEvent.on("sendEmail", (data) => {
    (0, sendEmail_1.sendEmail)(data.email, data.sentOtp, data.subject);
});
