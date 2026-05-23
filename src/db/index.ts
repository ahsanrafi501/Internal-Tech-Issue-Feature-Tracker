
import { Pool } from "pg";
import config from "../config";
import { ApiError } from "../utility/sendError";


export const pool = new Pool({
    connectionString: config.connection_string
})


export const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(50),
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(20),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `)


        await pool.query(` 
            CREATE TABLE IF NOT EXISTS issues(
                id SERIAL PRIMARY KEY,
                title VARCHAR(250),
                description TEXT,
                type VARCHAR(20),
                status VARCHAR(20),
                reporter_id INT REFERENCES USERS(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
            `)
            console.log("Database Connected Successfully");
    } catch (error) {
       throw new ApiError(500, "Can't creating database table")
    }
}