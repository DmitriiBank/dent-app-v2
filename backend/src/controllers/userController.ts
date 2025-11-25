import {UserDbModel} from '../schemas/user.schema';
import {HttpError} from '../errorHandler/HttpError';
import * as factory from './handlerFactory';
import {NextFunction, Request, Response} from 'express';
import {AuthRequest} from "../utils/quizTypes";
import {asAuth} from "../utils/tools";
import {
    userServiceImplMongo as service
} from "../services/UserServiceImplMongo";


export const getAllUsers = factory.getAll(UserDbModel);
export const getUserById = factory.getOne(UserDbModel, {path: 'testResults'})
export const updateUser = factory.updateOne(UserDbModel)
export const deleteUser = factory.deleteOne(UserDbModel)

const filterObj = (obj:  Record<string, any>, ...allowedFields: string[]) => {
    const newObj: Record<string, any> = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    })
    return newObj;
}


export const updateMe = asAuth(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const filteredBody = filterObj(req.body, 'name', 'email');

    const updatedUser = await service.updateMe( req.params.id, filteredBody);

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        },
    });
});

export const deleteMe = asAuth(async (req: AuthRequest, res: Response, next: NextFunction) => {
   await service.deleteMe( req.params.id);
    res.status(204).json({status: 'success', data: null});
})

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead'
    });
}

