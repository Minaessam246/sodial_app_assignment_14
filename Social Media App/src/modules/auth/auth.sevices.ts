import type { Request,Response } from "express";
import { ApplicationError } from "./../../utils/response/error.response";
import { IConfimEmailtype, ILogintype, ISignuptype } from "./auth.dto";
import { userModel } from "../../DB/models/user.model";


import bcrypt  from "bcrypt";
import { customAlphabet, nanoid } from "nanoid";
import { emailEvent } from "../../utils/events/email.event";
import CryptoJS from 'crypto-js';
import { DatabaseRepository } from "../../DB/Repository/database.repository";
import { IUser } from "./../../DB/Repository/database.repository";
import { UserRepository } from "./../../DB/Repository/user.repository";
import { generateToken, getLoginCredentials } from "../../utils/security/token.security";
import { HydratedDocument, RootFilterQuery } from "mongoose";
import { OAuth2Client, type TokenPayload } from "google-auth-library";








class AuthenticationService{
    constructor(){

  
    }

 userModel= new UserRepository(userModel)

findUser= new DatabaseRepository<IUser>(userModel);



private verifyEmail=async(idToken:string):Promise<TokenPayload>=>{
const client = new OAuth2Client();

 try {
   const ticket = await client.verifyIdToken({
      idToken,
      audience: "765880014065-git1shsdmpt5akdla32mu5bsvebdevpb.apps.googleusercontent.com", 

  });
  var payload = ticket.getPayload();
 } catch (e) {
  throw new ApplicationError("invalid id token",400)
 }


if (!payload) {
  throw new ApplicationError("invalid id token ",400)
}
return payload;

}
loginGmail= async (req:Request,res:Response):Promise<Response>=> {
const {idToken}=req.body
const {email}=await this.verifyEmail(idToken) 


  const user =await this.userModel.findOne({filter:{email} as Partial<IUser>})
const credentials:{
    accessToken:String,refreshToken:String
  }= getLoginCredentials(user as HydratedDocument<IUser>)
if (user) {
  return res.json({message:"logged in",credentials})
}

else {
  throw new ApplicationError("not registered user",400)
}

}







signupGmail= async (req:Request,res:Response):Promise<Response | void >=> {
const {idToken}=req.body
const {email,family_name,given_name}=await this.verifyEmail(idToken) 


  const user =await this.userModel.findOne({filter:{email}as Partial<IUser>})

if (user) {
  if (user.provider=="SYSTEM") {
  throw new ApplicationError("Registered without using Google",400)
}
else   if (user.provider=="GOOGLE") {
  this.loginGmail(req,res)
}
}
else{
  var created= await this.userModel.create({data:[{email ,username:(given_name as string+family_name ),provider:"GOOGLE"}as Partial<IUser>]})

if (created) {
      return res.status(201).json({message:"created",created})

}
else{
  throw new ApplicationError("signup error",400)
}

}


}
signup= async (req:Request,res:Response):Promise<Response>=> {


const {username,password,email,role}:ISignuptype=req.body
const check =await this.findUser.findOne({filter:{email}})

if (check) {
    throw new ApplicationError("email exists",409)

}
const custom=customAlphabet("1234567890",5)
const sentOtp=custom()
console.log(sentOtp);

const subject:string="confirmation email"
emailEvent.emit("sendEmail",{email,sentOtp,subject})
const otp =bcrypt.hashSync(sentOtp,10);



const hashedPassword=  await bcrypt.hash(password,10)




const user= await this.userModel.createUser({data:[{username,password:hashedPassword ,email,otp,role}],options:{validateBeforeSave:true}})
    if (user) {
    return res.status(201).json({message:"signedup",data:{username,password,email}})
    }

    return res.status(500).json({message:"can't sign up"})

}
verifyForgetCode = async (req: Request, res: Response) :Promise<Response> => {

 const { email, otp }: IConfimEmailtype = req.body;




    const user = await userModel.findOne( {email} );


    if (!user ||!user.resetPasswordOtp ||  !bcrypt.compareSync(otp, user?.resetPasswordOtp)) {
      throw new ApplicationError('Invalid email or OTP', 400);
    }

    

    return res.status(200).json({ message: 'otp confirmed successfully ' });


};
resetPassword = async (req: Request, res: Response) :Promise<Response> => {

const {email ,otp,newPassword }=req.body;


    const user = await userModel.findOne( {email} );


    if (!user ||!user.resetPasswordOtp ||  !bcrypt.compareSync(otp, user?.resetPasswordOtp)) {
      throw new ApplicationError('Invalid email or OTP', 400);
    }
const hashedPassword=  await bcrypt.hash(newPassword,10)



  
const updated= await this.userModel.updateOne({filter:{email},update:{password:hashedPassword} })
    if (updated.modifiedCount) {
    return res.status(201).json({message:"password reset "})
    }


   throw new ApplicationError("can't reset password",500)


};
sendForgetCode = async (req: Request, res: Response) :Promise<Response> => {

const {email}=req.body;
const custom=customAlphabet("1234567890",5)
const sentOtp=custom()
console.log(sentOtp);

const subject:string="Reset Password email"
emailEvent.emit("sendEmail",{email,sentOtp,subject})
const otp =bcrypt.hashSync(sentOtp,10);






if (await this.userModel.findOne({filter:{email}})) {
  
const updated= await this.userModel.updateOne({filter:{email},update:{resetPasswordOtp:otp} })
    if (updated.modifiedCount) {
    return res.status(201).json({message:"otp sent "})
    }
}

  throw new   ApplicationError("not registered user",400)


};


 confirmEmail = async (req: Request, res: Response) :Promise<Response> => {
  const { email, otp }: IConfimEmailtype = req.body;




    const user = await userModel.findOne( {email} );


    if (!user ||!user.otp ||  !bcrypt.compareSync(otp, user?.otp)) {
      throw new ApplicationError('Invalid email or OTP', 400);
    }

    if (user?.confirmEmail) {
      return res.status(200).json({ message: 'Email already confirmed' });
    }

    await userModel.updateOne({ email }, { confirmEmail: true });

    return res.status(200).json({ message: 'Email confirmed' });

};
 login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password }:ILogintype = req.body;

  const user = await userModel.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password as string) ) {
    throw new ApplicationError('Invalid email or password or email not confirmed', 400);

  }
  console.log(user);
  
const credentials:{
    accessToken:String,refreshToken:String
  }= getLoginCredentials(user as HydratedDocument<IUser>)


  return res.status(200).json({message:"Logged in successfully",credentials});
}
}
export default new AuthenticationService()