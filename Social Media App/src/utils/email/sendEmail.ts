
// import nodemailer from "nodemailer";
// export const sendEmail=(email:any,otp:any,subject:any)=>{

// // Create a test account or replace with real credentials.
// const transporter = nodemailer.createTransport({
// service:"gmail", // true for 465, false for other ports
//   auth: {
//     user: "minaessam1810@gmail.com",
//     pass: "avxt gurv ivzl xzbp",
//   },
// });

// // Wrap in an async IIFE so we can use await.
// (async () => {
//   const info = await transporter.sendMail({
//     from: 'minaessam1810@gmail.com',
//     to: email,
//     subject,
//     text: otp, // plain‑text body
   
//   });

//   console.log("Message sent:", info.messageId);
// })();

// }
import  nodemailer  from "nodemailer";

export async function  sendEmail(email:any,otp:any,subject:any) {
    const transporter = nodemailer.createTransport({
service:"gmail",
    auth: {
      user: "minaessam1810@gmail.com", 
      pass:  "vgqu hlet ocfl omql"   ,

    },
});

// Wrap in an async IIFE so we can use await.
(async () => {
  const info = await transporter.sendMail({
    from: `Social App`,
    to:email,
    subject,
    text:`confirmation otp ${otp}`, // plain‑text body
 // HTML body
  });
  console.log(info.messageId);
  


})();
}