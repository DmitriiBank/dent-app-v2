import {NextFunction, Request, RequestHandler, Response} from "express";
import {UserDbModel} from "../schemas/user.schema";
import {HttpError} from "../errorHandler/HttpError";
import jwt from "jsonwebtoken";
import {AuthRequest, Roles} from "../utils/quizTypes";
import {asAuth} from "../utils/tools";
import {createSendToken} from "../utils/jwt";

// ---- JWT Payload interface ----
interface JWTPayload {
    id: string;
    iat: number;
    exp: number;
}

export const protect: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies?.accessToken;

    if (!token) return next(new HttpError(401, 'You are not logged in'));
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JWTPayload;


        const currentUser = await UserDbModel.findById(decoded.id);
        if (!currentUser) {
            return next(new HttpError(401, 'The user belongs to this token does no longer exist!'));
        }

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new HttpError(401, 'User recently changed password! Please log in again.'));
        }

        req.user = currentUser;
        next();
    } catch (e) {
        next(new HttpError(401, 'Invalid token'));
    }
};
;

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

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.refreshToken;

    if (!token) return next(new HttpError(401, 'No refresh token'));

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
        const user = await UserDbModel.findById(decoded.id);
        if (!user) return next(new HttpError(401, 'User not found'));

        createSendToken(user, 200, res);
    } catch (e) {
        next(new HttpError(401, 'Invalid refresh token'));
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ status: 'success' });
};