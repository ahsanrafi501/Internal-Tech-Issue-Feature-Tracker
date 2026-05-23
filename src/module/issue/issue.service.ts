import { pool } from "../../db";
import { userRole } from "../../types";
import { ApiError } from "../../utility/sendError";
import type { Tissue, Tpayload } from "./issue.interface";

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
        const { sort = "newest", type, status } = query;
        const sortOrder = sort === "oldest" ? "ASC" : "DESC";

        const issueResult = await pool.query(
            `
            SELECT *
            FROM issues
            WHERE
                ($1::text IS NULL OR type = $1)
                AND ($2::text IS NULL OR status = $2)
            ORDER BY created_at ${sortOrder}
            `,
            [type || null, status || null]
        );

        const allIssues = issueResult.rows;

        const issuesWithUser = await Promise.all(
            allIssues.map(async (issue) => {
                const userResult = await pool.query(
                    `SELECT id, name, email, role FROM users WHERE id = $1`,
                    [issue.reporter_id]
                );

                issue.reporter = userResult.rows[0] || null;
                delete issue.reporter_id;

                return issue;
            })
        );

        return issuesWithUser;

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




const updateIssuesFromDB = async (payload: Tpayload) => {
    try {
        const { id, title, description, user, type } = payload;

        if (user.role === userRole.maintainer) {
            const result = await pool.query(`
                UPDATE issues
                SET title = COALESCE($1, title), 
                    description = COALESCE($2, description), 
                    type = COALESCE($3, type)
                WHERE id = $4 
                RETURNING *
            `, [title, description, type, id]);
            
            return result.rows[0] || null;
        } else {
            const issue = await pool.query(`
                SELECT * FROM issues WHERE id = $1
            `, [id]);

            const issueData = issue.rows[0];

            if (!issueData) {
                throw new ApiError(404, "Issue not found");
            }

            if (user.id !== issueData.reporter_id) {
                throw new ApiError(403, "Contributor can only update their own issue");
            }

            const result = await pool.query(`
                UPDATE issues
                SET title = COALESCE($1, title), 
                    description = COALESCE($2, description), 
                    type = COALESCE($3, type)
                WHERE id = $4 
                RETURNING *
            `, [title, description, type, id]);
            
            return result.rows[0];
        }

    } catch (error: any) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, error.message);
    }
};





const deleteUserFromDB =  async(id: number) =>{
    try {

        const findIssue = await pool.query(`
            SELECT * FROM issues WHERE id = $1 
            `,[id])
        if(findIssue.rows.length === 0){
            throw new ApiError(404, "Issues not found to delete");
        }

        const result = await pool.query(`
          DELETE FROM issues WHERE id = $1 RETURNING *
            `, [id])
            return result.rows[0]
    } catch (error: any) {
        throw new ApiError(error.statusCode, error.message)
    }
}






export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssuesFromDB,
    deleteUserFromDB,

}