import { EventEmitter } from "stream";
import { sendEmail } from "./../email/sendEmail";

export const emailEvent=new EventEmitter()
emailEvent.on("sendEmail",(data)=>{
    sendEmail(data.email,data.sentOtp,data.subject)
})
