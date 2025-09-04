import { model ,Schema, Types} from "mongoose";


export interface IToken{
jti?:String,
expiresIn?:Number,
userID?:Types.ObjectId
}

export const tokenModel= model("token",new Schema<IToken>({
jti:String,
expiresIn:Number,
userID:{type:Schema.Types.ObjectId,ref:"user"}


}))