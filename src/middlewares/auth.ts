import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// middleware to make sure only admin allowed
export const isAdmin = TryCatch(
    async (req, res, next)=>{
        const {id} = req.query;
        if(!id) return next(new ErrorHandler("Please login the user",401));

        const user = await User.findById(id);
        if(!user) return next(new ErrorHandler("Invalid id", 401));

        if(user.role !== "admin")
         return next(new ErrorHandler("Not accessible!", 401)); 
        next();
        });