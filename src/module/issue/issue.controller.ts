import type { NextFunction, Request, Response } from "express";
import { issueService } from "./issue.service";
import { ApiResponse } from "../../utility/sendResponse";
import { ApiError } from "../../utility/sendError";
const createIssue = async (req: Request, res: Response) => {

    try {
        const result = await issueService.createIssueIntoDB(req.body, req.user);
        res.status(201).json(new ApiResponse(201, "Issues submitted successfully", result.rows[0]))

    } catch (error: any) {
        throw new ApiError(404, error.message)
    }


}


const getAllIssues = async (req: Request, res: Response) => {
    try {

        const result = await issueService.getAllIssuesFromDB(req.query);

        res.status(200).json(
            new ApiResponse(
                200,
                "Issues retrieved successfully",
                result
            )
        );

    } catch (error: any) {
        throw new ApiError(500, error.message);
    }
};


const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await issueService.getSingleIssueFromDB(Number(id))
        res.status(200).json(new ApiResponse(200, "Single user retrieved successfully", result))
    } catch (error: any) {
        throw new ApiError(404, error.message)
    }

}

interface AuthenticatedRequest extends Request {
    user?: any;
}

const updateIssues = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const query = req.body;
        const user = req.user;
        const updateDoc = { ...query, user, id: Number(id) };
        
        const result = await issueService.updateIssuesFromDB(updateDoc);
        
        return res.status(200).json(
            new ApiResponse(200, "issues updated successfully", result)
        );
    } catch (error) {
        next(error);
    }
};



const deleteIssure = async(req: Request, res: Response) =>{
    try {
        const {id} = req.params;
        const result = await issueService.deleteUserFromDB(Number(id))
        res.status(200).json(new ApiResponse(200, "Issue deleted successfully", result))
    } catch (error: any) {
        throw new ApiError(error.statusCode, error.message)
    }
}



export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssues,
    deleteIssure,
}