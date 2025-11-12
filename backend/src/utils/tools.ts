import {AuthRequest} from "./quizTypes";
import {NextFunction, RequestHandler, Response} from "express";


export const asAuth =
    (fn: (req: AuthRequest, res: Response, next: NextFunction) => any): RequestHandler =>
        (req, res, next) =>
            fn(req as AuthRequest, res, next);