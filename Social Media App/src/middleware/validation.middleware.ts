// import { NextFunction ,Request,Response} from "express";
// import { ZodError, ZodType } from "zod";
// import { ApplicationError } from "../utils/response/error.response";

// type KeyReqType=keyof Request;
// type SchemaType=Partial<Record<KeyReqType,ZodType>>
// let validtionErrors=[]
// export const validation =(schema:SchemaType)=>{
//     return (req:Request,res:Response,next:NextFunction)=>{
// for (const key of Object.keys(schema) as KeyReqType[]) {
//   if (!schema[key]) continue;
//   const validationResult=schema[key].safeParse(req[key])
// if (!validationResult.success) {
//     const errors=validationResult.error as ZodError
//     validtionErrors.push({key:key,issues:errors.issues})
// }
// if (validtionErrors.length) {
//     throw new ApplicationError("validtion Error",400,validtionErrors)
// }
    
 
// }
// return next()as unknown as NextFunction
// }
// }
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { ApplicationError } from "../utils/response/error.response";

// Define which parts of the request can be validated
type KeyReqType = keyof Request; // e.g., 'body', 'query', 'params', 'headers'
type SchemaType = Partial<Record<KeyReqType, ZodTypeAny>>;

export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: Array<{
      key: string;
      issues: ZodError['issues'];
    }> = [];

    for (const key of Object.keys(schema) as KeyReqType[]) {
      const validator = schema[key];
      if (!validator) continue;

      const result = validator.safeParse(req[key]);

      if (!result.success) {
        validationErrors.push({
          key: key.toString(), // Fix: convert to string
          issues: result.error.issues,
        });
      }
    }

    if (validationErrors.length > 0) {
      return next(
        new ApplicationError("Validation Error", 400, validationErrors)
      );
    }

    return next();
  };
};
