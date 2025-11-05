
import { Request } from "express";
import {User} from "../model/User.js";

export interface AuthRequest extends Request {
    user: User;
}

export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
    GUEST = 'guest'
}