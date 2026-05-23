import { pool } from "../../db";
import { ApiError } from "../../utility/sendError";
import type { Tissue } from "./issue.interface";

const createIssueIntoDB = async (payload: Tissue, user: any) => {
    const { title, description, type, status = "open" } = payload;
    const { id } = user;
    if (!user || !id) {
        throw new ApiError(401, "User session expired or invalid")
    }
    // console.log(id);
    const result = await pool.query(`
        INSERT INTO issues(title, description, type, status, reporter_id)
        VALUES($1, $2, $3, $4, $5) RETURNING *
        `, [title, description, type, status, id])

    return result;
}


const getAllIssuesFromDB = async (query: any) => {
    try {

        const {
            sort = "newest",
            type,
            status
        } = query;

        const sortOrder =
            sort === "oldest" ? "ASC" : "DESC";

        const issueResult = await pool.query(
            `
            SELECT *
            FROM issues
            WHERE
                ($1::text IS NULL OR type = $1)
                AND ($2::text IS NULL OR status = $2)
            ORDER BY created_at ${sortOrder}
            `,
            [
                type || null,
                status || null
            ]
        );
        const issueResults = issueResult.rows[0];

        const userResult = await pool.query(`
                SELECT * FROM users WHERE id = $1 
            `, [issueResults.reporter_id])

        issueResults.reporter = userResult.rows[0];
        delete issueResults.reporter_id;
        return issueResults;

    } catch (error: any) {
        throw new ApiError(500, error.message);
    }
};


const getSingleIssueFromDB = async (id: number) => {

    try {

        const issueResults = await pool.query(`
            SELECT * 
            FROM issues 
            WHERE id = $1
        `, [id]);

        if (issueResults.rows.length === 0) {
            throw new ApiError(404, "Issue does not exist");
        }

        const issueResult = issueResults.rows[0];

        const userResult = await pool.query(`
            SELECT id, name, email
            FROM users 
            WHERE id = $1
        `, [issueResult.reporter_id]);

        if (userResult.rows.length === 0) {
            throw new ApiError(404, "User not found for the report");
        }

        issueResult.reporter = userResult.rows[0];

        delete issueResult.reporter_id;

        return issueResult;

    } catch (error: any) {

        throw new ApiError(
            error.statusCode || 500,
            error.message || "Something went wrong"
        );

    }
};

export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,

}