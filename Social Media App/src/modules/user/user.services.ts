import { NextFunction,Request,Response } from "express";
import { IReq } from "../../middleware/authentication.middelware";
import { ILogoutDto } from "./user.dto";
import { HydratedDocument, RootFilterQuery, UpdateQuery } from "mongoose";
import { IUser } from "../../DB/Repository/database.repository";
import { UserRepository } from "../../DB/Repository/user.repository";
import { userModel } from "../../DB/models/user.model";
import { IToken, tokenModel } from "../../DB/models/token.model";
import { TokenRepository } from "./../../DB/Repository/token.repository";
import { getLoginCredentials } from "../../utils/security/token.security";





class userServices{
    private userModel=new  UserRepository(userModel)
    private tokenModel=new  TokenRepository(tokenModel)
    constructor(){}
 profile=async (req:Request,res:Response,next:NextFunction):Promise<Response>=>{
    const Ireq= req as  IReq

return res.json({message:"profile",user:Ireq.user})


}
 refreshToken = async (req: Request, res: Response): Promise<Response> => {
const Ireq= req as IReq
const {email,_id}=Ireq.user
const {jti}=Ireq.decoded
  const user = await userModel.findOne({ email });


  console.log(user);
  
const credentials:{
    accessToken:String,refreshToken:String
  }= getLoginCredentials(user as HydratedDocument<IUser>)

await this.tokenModel.create({data:[{jti,userID:_id}as Partial<IToken>]})
  return res.status(200).json({message:"login renewed",credentials});
}








 logout=async (req:Request,res:Response,next:NextFunction):Promise<Response>=>{
    const Ireq= req as  IReq
    const {flag}:ILogoutDto=req.body
      const  {_id}=Ireq.user
      const  {jti,iat} =Ireq.decoded 

    const update:UpdateQuery<IUser>={}

    switch (flag) {
        case "all":
              await userModel.updateOne({_id,changeCredentialTime:Date.now() })

            break;
        case "only":
            await this.tokenModel.create({data:[{jti,userID:_id}as Partial<IToken>]})
            break;
    
        default:
            break;
    };

return res.json({message:"done"})
}

}


export default  new userServices()