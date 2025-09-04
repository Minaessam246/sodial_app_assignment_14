import { JwtPayload, Secret, sign, SignOptions } from "jsonwebtoken"
import { HydratedDocument } from "mongoose"
import { IUser } from "../../DB/Repository/database.repository"
import { verify } from "jsonwebtoken"
// import { ApplicationError } from "../response/error.response"
import { UserRepository } from "../../DB/Repository/user.repository"
import { nanoid } from "zod"
import { customAlphabet } from "nanoid"







export const generateToken= ({payload,secret,options}:{payload:object,secret:Secret,options?:SignOptions}):String=>{
return   sign(payload,secret,options)
}

const detectSignatureLevel=(role:String):String=>{
    let signatureLevel:String;
if (role=="admin") {
    signatureLevel="System"
}
else{signatureLevel="Bearer"}
return signatureLevel;
}
const getSignatures=(signatureLevel:String)=>{
    var signatures:{access_Signature:string,refresh_Signature:string}={access_Signature:"",refresh_Signature:""}
if (signatureLevel=="Bearer") {
    signatures={access_Signature:"userAccessSiganture",refresh_Signature:"userRefreshSiganture"}
}
else if (signatureLevel=="System") {
    signatures={access_Signature:"adminAccessSiganture",refresh_Signature:"adminRefreshSiganture"}
}
return signatures;
}

export const getLoginCredentials=(user:HydratedDocument<IUser>):{accessToken:String,refreshToken:String}=>{
        const payload = {
    userId: user._id,
    email: user.email,
    timestamp: Date.now(),
  };
        var credentials:{
    accessToken:String,refreshToken:String
  } = {
    accessToken:"",refreshToken:""
  };
const signatureLevel= detectSignatureLevel(user.role);
const sigantures =getSignatures(signatureLevel);
console.log(signatureLevel,sigantures);
const jwtid=customAlphabet("123456789abcdfghi",12)()
 credentials.accessToken=  generateToken({payload:payload,secret:sigantures.access_Signature,options:{expiresIn:"1h",jwtid}},)
 credentials.refreshToken= generateToken({payload:payload,secret:sigantures.refresh_Signature,options:{expiresIn:"1y",jwtid}},)
 console.log(credentials)
 return credentials
}
export const decodeToken=({authorization,tokenType}:{authorization:string,tokenType:string}):JwtPayload | void | string=>{
const [key ,token]=authorization.split(" ");
if (!key || !token) {
return;
 
}
try {
    const signatures=getSignatures(key);
    console.log(signatures,token);
    
if (tokenType=="access") {
    return verify(token,signatures.access_Signature)
}
else if (tokenType=="refresh") {
    return verify(token,signatures.refresh_Signature)
}
} catch (error) {
    // throw new ApplicationError("invalid token",400)
}

}