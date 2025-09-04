
import { RoleEnum } from "../../DB/models/user.model"
import  * as validators from "./auth.validation"
import z from "zod"

export interface ISignuptype {
username:string,
password:string,
email:string,
age:Number,
role:RoleEnum,


}
export interface IConfimEmailtype {


email:string,
otp:string


}
export type ILogintype = z.infer<typeof validators.login.body>