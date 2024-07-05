import { NextFunction, Response, Request } from "express";

export interface NewUserRequestBody {
    username?: string;
    name: string;
    photo: string;
    email: string;
    gender: string;
    role: string;
    _id: string;
    dob: Date;
}
export interface NewProductBody {
    name: string;
    photo: string;
    price: Number;
    stock: Number;
    category: String
}
export type ControllerType = (
    req: Request<any>,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;