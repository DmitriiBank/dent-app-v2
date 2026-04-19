
import { Request } from "express";
import {User} from "../model/User";

export interface AuthRequest extends Request {
    user: User;
}

export enum Roles {
    USER = 'user',
    TEACHER = 'teacher',
    ADMIN = 'admin',
    GUEST = 'guest'
}
