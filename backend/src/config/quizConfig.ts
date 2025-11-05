
import dotenv from "dotenv";
dotenv.config();

export const PORT=3555;
export const baseUrl = `http://localhost:${PORT}`;
export const db = process.env.DATABASE!.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!);


