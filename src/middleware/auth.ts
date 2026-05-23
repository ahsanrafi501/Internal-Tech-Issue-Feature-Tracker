import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utility/sendError";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { role } from "../types";

const auth = (...role: role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accessToken = req.headers.authorization;
            if (!accessToken) {
                throw new ApiError(401, "Unauthorized access")
            }

            const decoded = await jwt.verify(accessToken as string, config.accessTokenSecret as string) as JwtPayload;
            const userData = await pool.query(`
            SELECT * FROM users WHERE email=$1
            `, [decoded.email])

            const user = userData.rows[0];
            if (user.length === 0) {
                throw new ApiError(404, "User not found");
            }

            if (role.length && !role.includes(user.role)) {
                throw new ApiError(403, "Unauthorized access")
            }
            req.user = user;
            next();
        }
        catch (error: any) {
            next(error);
        }
    }
}


export default auth;