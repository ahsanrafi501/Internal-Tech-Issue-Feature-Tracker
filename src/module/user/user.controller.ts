import type { Request, Response } from "express";
import { userService } from "./user.service";
import { ApiResponse } from "../../utility/sendResponse";
import { ApiError } from "../../utility/sendError";

const signupUser = async(req: Request, res: Response) =>{
    try {
        const result = await userService.userSignupIntoDB(req.body)
        res.status(200).json(new ApiResponse(200, "User successfully registered", result.rows[0]))
    } catch (error: any) {
        res.status(400).json(new ApiResponse(400, error.message))
    }
}


const userLogin = async(req: Request, res: Response) =>{
    try {
        const result = await userService.userLoginIntoDB(req.body);
        console.log(result);
        res.status(200).json(new ApiResponse(200, "User login successfully", result))
    } catch (error: any) {
        throw new ApiError(404, error.message);
    }
}


export const userController = {
    signupUser,
    userLogin,
}