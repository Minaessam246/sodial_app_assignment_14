import { NextFunction,Request,Response } from "express";

import {   userModel } from "../DB/models/user.model";
import { DatabaseRepository, IUser } from "../DB/Repository/database.repository";
import { UserRepository } from "../DB/Repository/user.repository";
import { decodeToken } from "../utils/security/token.security";
import { ApplicationError } from "../utils/response/error.response";

import { HydratedDocument } from "mongoose";
import { tokenModel } from "../DB/models/token.model";
import { JwtPayload } from "jsonwebtoken";


export interface IReq extends Request{
user:HydratedDocument<IUser>;
decoded:JwtPayload
}
export const authentication=(allowed:String[],tokenType:string)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
  const  Ireq=req as IReq
  const userr= new DatabaseRepository<IUser>(userModel)
    
    if (!req.headers?.authorization) {
    throw new ApplicationError("token is required ",400)
        return res.json()

}


const {authorization}=req.headers
 const [key ]=authorization.split(" ");

if (!allowed.includes(key as never)) {
    throw new ApplicationError("not authorized",400)
   
}
try {

    var verification =JSON.stringify(decodeToken({authorization,tokenType,}))
const user= await userr.findOne(JSON.parse(verification).email)
console.log(verification);



Ireq.user=user;
Ireq.decoded=JSON.parse(verification);
const x=JSON.parse(verification).jti

if (((user.changeCredentialTime?.getTime() || 0)) > JSON.parse(verification).iat*1000 ) {
   throw new ApplicationError("logged out form all devices ",400)
}
if (await tokenModel.findOne({jti:x})) {
  throw new ApplicationError("logged out user or bad refresh token",400)
}

next()
} catch (error) { throw new ApplicationError("invalid token",400)}

    
}


}
