import type { Request, Response } from "express";
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



export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue
}