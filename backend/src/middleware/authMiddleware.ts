import {NextFunction, Request, RequestHandler, Response} from "express";
import {UserDbModel} from "../schemas/user.schema";
import {HttpError} from "../errorHandler/HttpError";
import jwt from "jsonwebtoken";
import {AuthRequest, Roles} from "../utils/quizTypes";
import {asAuth} from "../utils/tools";

// ---- JWT Payload interface ----
interface JWTPayload {
    id: string;
    iat: number;
    exp: number;
}

export const protect: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);
    else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new HttpError(401, 'You are not logged in! Please log in'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    //console.log(decoded);

    const currentUser = await UserDbModel.findById(decoded.id);
    if (!currentUser) {
        return next(new HttpError(401, 'The user belongs to this token does no longer exist!'));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new HttpError(401, 'User recently changed password! Please log in again.'));
    }

    req.user = currentUser;
    next();
};

export const restrictTo = (...roles: Roles[]) => {
    return asAuth((req: AuthRequest, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role as Roles)) {
            return next(
                new HttpError(403, 'You do not have permission to perform this action'),
            );
        }
        next();
    });
};