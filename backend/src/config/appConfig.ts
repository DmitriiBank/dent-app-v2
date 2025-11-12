
import dotenv from "dotenv";
import path from "node:path";
import {readFileSync} from "node:fs";
dotenv.config();

export const PORT=3555;
export const baseUrl = `http://localhost:${PORT}`;
export const db = process.env.DATABASE!.replace('<PASSWORD>', process.env.DATABASE_PASSWORD!);

const jsonPath = path.resolve(process.cwd(), "app-config", "app-config.json");
const appConf = JSON.parse(readFileSync(jsonPath, "utf-8"));

export interface AppConfig {
    port:number,
    skipRoutes:string[],
    pathRoles: Record<string, string[]>,
    checkIdRoutes:string[],
    mongoUri:string,
    jwt:{
        secret:string,
        exp:string|number
    },
    logLevel:string
}

export const configuration:AppConfig = {
    ...appConf,
    mongoUri: db || "dev db address",
    jwt:{
        secret: process.env.JWT_SECRET || "super-secret",
        exp: process.env.JWT_EXPIRES_IN || "90d"
    }
}