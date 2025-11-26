
import { Request } from "express";
import {User} from "../model/User";
import {JwtPayload} from "jsonwebtoken";

export interface AuthRequest extends Request {
    user: User;
}

export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
    GUEST = 'guest'
}
export interface GoogleJwtPayload extends JwtPayload {
    email: string;
    name: string;
    picture: string;
}