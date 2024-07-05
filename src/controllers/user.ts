import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";


export const createUser = TryCatch(
    async(
        req: Request <{},{},NewUserRequestBody>,
        res: Response,
        next: NextFunction) => {
        //    return next (new ErrorHandler("Custom Handler",402));
           const {name, email, photo, gender, _id, dob} = req.body;
           if(!_id || !name || !email || !photo || !gender || !dob)
            return next(new ErrorHandler("Please add all fields", 400));
           const user =  await User.create({
            name,
            email,
            photo,
            gender,
            _id,
            dob,
           });
    
           res.status(200).json({
            success: true,
            message: `User , ${user.name} created successfully`
           })
    
    }
);

export const getAllUsers = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await User.find({});
      res.status(200).json({
        success: true,
        users,
        
      });
     
    }
  );

  export const getUserById = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {

      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      res.status(200).json({
        success: true,
        user,
      });
    }
  );

  export const deleteUser = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
  
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
  
      res.status(200).json({
        success: true,
        message: `User ${user.name} deleted successfully`,
      });
    }
  );