import { pool } from "../../db";
import type { Tissue } from "./issue.interface";

const createIssueIntoDB = async(payload: Tissue) =>{
    const {title, description, type, status = "open"} = payload;
    const result = await pool.query(`
        INSERT INTO issue(title, description, type, status)
        VALUES($1, $2, $3, $4)
        `,[title, description, type, status])

        return result;
}


export const issueService = {
    createIssueIntoDB,

}