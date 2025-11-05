import {UserDbModel} from '../schemas/user.schema.js';
import {HttpError} from '../errorHandler/HttpError.js';
import * as factory from './handlerFactory.js';
import {NextFunction, Request, Response} from 'express';


const filterObj = (obj:  Record<string, any>, ...allowedFields: string[]) => {
    const newObj: Record<string, any> = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    })
    return newObj;
}

export const getMe = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user)
    req.params.id = req.user._id;
    next()
}

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new HttpError(400, 'This route is not for password update. Please use /updateMyPassword'));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');

    const updatedUser = await UserDbModel.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        },
    });
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
    await UserDbModel.findByIdAndUpdate(req.user._id, { active: false });

    res.status(200).json({
        status: 'success',
        data: null,
    });
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead'
    });
}

export const getAllUsers = factory.getAll(UserDbModel);
export const getUserById = factory.getOne(UserDbModel, {path: 'testResults'})

export const updateUser = factory.updateOne(UserDbModel)
export const deleteUser = factory.deleteOne(UserDbModel)

