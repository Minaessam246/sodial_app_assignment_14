import { NextFunction ,Request,Response} from "express"

// export  interface IError extends Error{
// statusCode:number
// }
// export  class ApplicationException extends Error{
// constructor(message:string,public statusCode:number,cause?:unknown){
// super(message,{cause})
// this.name=this.constructor.name;

// }
// }
// export const errorHandler=(error:IError,req: Request, res: Response, next: NextFunction) => {
//    return res.status(error.statusCode).json({err_message:error.message,stack:error.stack,cause:error.cause})
//   }



export interface IError extends Error{
    statusCode:number
}
export class ApplicationError extends Error{
    constructor(message:string,public statusCode:number,cause?:object){
super(message,{cause})
    }
}
export const errorHandler=(error:IError,req:Request,res:Response,next:NextFunction)=>{
return res.status(error.statusCode).json({Error:error.message,cause:error.cause})
}