import { pool } from "../../db";
import { ApiError } from "../../utility/sendError";
import type { Tissue } from "./issue.interface";

const createIssueIntoDB = async(payload: Tissue, user: any) =>{
    const {title, description, type, status = "open"} = payload;
    const {id} = user;
    if(!user || !id){
        throw new ApiError(401, "User session expired or invalid")
    }
    // console.log(id);
    const result = await pool.query(`
        INSERT INTO issues(title, description, type, status, reporter_id)
        VALUES($1, $2, $3, $4, $5) RETURNING *
        `,[title, description, type, status, id])

        return result;
}


export const issueService = {
    createIssueIntoDB,

}