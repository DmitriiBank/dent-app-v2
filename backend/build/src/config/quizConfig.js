import mysql from 'mysql2/promise';
import dotenv from "dotenv";
dotenv.config();
export const PORT = 3555;
export const baseUrl = `http://localhost:${PORT}`;
export const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
//========mySQL Connection======
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
export const SKIP_ROUTES = [
    "POST/accounts"
];
// const connection = await pool.getConnection();
