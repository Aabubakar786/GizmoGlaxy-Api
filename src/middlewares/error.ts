import { NextFunction, Request,Response } from "express"
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware = (err: ErrorHandler, req:Request, res: Response, next:NextFunction)=>{
    err.message ||=  "Internal server error";
    err.statusCode ||= 500;
    return res.status(err.statusCode).json({
     success: false,
     message: err.message
    })
 }

 export const TryCatch = (func: ControllerType) => {
    return async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
      try {
        await func(req, res, next);
      } catch (error) {
        next(error); 
      }
    };
  };