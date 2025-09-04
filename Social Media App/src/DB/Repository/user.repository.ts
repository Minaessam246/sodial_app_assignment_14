import { CreateOptions, HydratedDocument, Model } from "mongoose";
import { DatabaseRepository, IUser } from "./database.repository";

export class UserRepository extends DatabaseRepository<IUser>{
constructor (protected override readonly model:Model<IUser>){
    super(model)
}
    async createUser({data,options}:{data:Partial<IUser>[],options:CreateOptions}):Promise<HydratedDocument<IUser>[]| undefined>{
   return await this.model.create(data ,options) }
}