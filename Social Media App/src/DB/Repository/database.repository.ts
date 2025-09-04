import { CreateOptions, HydratedDocument, Model , UpdateQuery,ProjectionType, QueryOptions, RootFilterQuery, RootQuerySelector } from "mongoose";
import { RoleEnum } from "../models/user.model";
export interface IUser{
        username:string,
    email:string,
    password?:string | null,
    otp?:string | null,
    confirmEmail:boolean,
    role:RoleEnum
    provider:string 
      

 
}

export  class DatabaseRepository<TDocument>{
    constructor(protected readonly model:Model<TDocument>){

    }
    async create({data,options}:{data:Partial<TDocument>[],options?:CreateOptions}):Promise<HydratedDocument<TDocument>[]| undefined>{
   return await this.model.create(data ,options) }
    async findOne({filter,select,options}:{filter?:RootFilterQuery<TDocument>,select?:ProjectionType<TDocument>,options?:QueryOptions<TDocument>}):Promise<HydratedDocument<TDocument>[]| undefined | any >{
   return await this.model.findOne(filter,select ,options) }
    async updateOne({filter,update,}:{filter:RootFilterQuery<TDocument>,update:UpdateQuery<TDocument> }):Promise<HydratedDocument<TDocument>[]| undefined | any >{
   return await this.model.updateOne(filter,update ) }
}