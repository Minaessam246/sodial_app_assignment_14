import { model ,Schema} from "mongoose";



export enum RoleEnum{
    user="user",
    admin="admin"
}
export const userModel= model("users",new Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String ,required:false},
   role:     { type: String, enum: Object.values(RoleEnum), default: RoleEnum.user },
    otp:{type:String,required:false},
    resetPasswordOtp:{type:String,required:false},
    confirmEmail:{type:Boolean,default:false},
    changeCredentialTime:{type:Date,required:false},
    provider:{type:String,default:"SYSTEM"},


}))