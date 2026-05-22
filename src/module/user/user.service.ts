import { pool } from "../../db"
import { ApiError } from "../../utility/sendError";
import type { Tuser } from "./user.interface"

const userSignupIntoDB = async(payload: Tuser)=>{
    const {name, email, password, role} = payload;
    try {
       const result =  await pool.query(`
            INSERT INTO users(name, email, password, role)
            VALUES($1, $2, $3, $4) RETURNING *
            
            `, [name, email, password, role]);
            delete result.rows[0].password
            return result
    } catch (error) {
        throw new ApiError(500, "Something went wrong while interting data")
    }
}

export const userService = {
    userSignupIntoDB,

}