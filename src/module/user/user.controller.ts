import type { Request, Response } from "express";
import { userService } from "./user.service";
import { ApiResponse } from "../../utility/sendResponse";

const signupUser = (async(req: Request, res: Response) =>{
    try {
        const result = await userService.userSignupIntoDB(req.body)
        res.status(200).json(new ApiResponse(200, "User successfully registered", result.rows[0]))
    } catch (error: any) {
        res.status(400).json(new ApiResponse(400, error.message))
    }
})



export const userController = {
    signupUser,
}