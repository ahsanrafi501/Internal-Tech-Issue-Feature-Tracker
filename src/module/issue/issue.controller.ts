import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import { ApiResponse } from "../../utility/sendResponse";
import { ApiError } from "../../utility/sendError";

const createIssue = async (req: Request, res: Response) => {

    try {
        const result = await issueService.createIssueIntoDB(req.body);
        new ApiResponse(200, "Issues submitted successfully", result.rows[0]);

    } catch (error: any) {
        throw new ApiError(404, error.message)
    }


}



export const issueController = {
    createIssue,
}