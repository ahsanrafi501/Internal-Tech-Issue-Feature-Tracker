import config from "../../config";
import { pool } from "../../db"
import { ApiError } from "../../utility/sendError";
import type { TuserLogin, TuserSignup } from "./user.interface"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSignupIntoDB = async (payload: TuserSignup) => {
    const { name, email, password, role } = payload;
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const result = await pool.query(`
            INSERT INTO users(name, email, password, role)
            VALUES($1, $2, $3, $4) RETURNING *
            
            `, [name, email, hashPassword, role]);
        delete result.rows[0].password
        return result
    } catch (error: any) {
        throw new ApiError(500, error.message)
    }
}

const userLoginIntoDB = async (payload: TuserLogin) => {
    try {
        const { email, password } = payload;
        const userInfo = await pool.query(`
        SELECT * FROM users WHERE email = $1  
        `, [email])

        if (userInfo.rows[0] === 0) {
            throw new ApiError(404, "User not found")
        }
        const user = userInfo.rows[0]
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            throw new ApiError(401, "Pasword doesn't matched");
        }

        const jwtPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }

        const accessToken = jwt.sign(jwtPayload, config.accessTokenSecret as string, { expiresIn: '1d' })
        console.log(accessToken);
        return { accessToken };
    } catch (error:any) {
        throw new ApiError(500, error.message)
    }


}

export const userService = {
    userSignupIntoDB,
    userLoginIntoDB
}