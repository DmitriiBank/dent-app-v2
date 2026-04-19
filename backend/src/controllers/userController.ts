import {UserDbModel} from '../schemas/user.schema';
import { AuditLog } from '../schemas/auditLog.schema';
import {HttpError} from '../errorHandler/HttpError';
import * as factory from './handlerFactory';
import {NextFunction, Request, Response} from 'express';
import {AuthRequest} from "../utils/quizTypes";
import { writeAuditLog } from "../utils/audit";
import {asAuth} from "../utils/tools";
import {
    userServiceImplMongo as service
} from "../services/UserServiceImplMongo";


export const getAllUsers = factory.getAll(UserDbModel);
export const getUserById = factory.getOne(UserDbModel, {path: 'testResults'})
export const getAuditLogs = async (req: Request, res: Response) => {
    const logs = await AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(200)
        .populate({ path: "actor", select: "name email role" });

    res.status(200).json({
        status: 'success',
        results: logs.length,
        data: logs,
    });
};
const filterObj = (obj:  Record<string, any>, ...allowedFields: string[]) => {
    const newObj: Record<string, any> = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    })
    return newObj;
}

const filterAdminPayload = (obj: Record<string, any>) =>
    filterObj(obj, 'name', 'email', 'role', 'avatar');

const serializeUser = (user: any) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || null,
    provider: user.provider || 'local',
    testResults: user.testResults || [],
});


export const updateMe = asAuth(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const filteredBody = filterObj(req.body, 'name', 'email');

    const updatedUser = await service.updateMe(req.user._id, filteredBody);

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        },
    });
});

export const deleteMe = asAuth(async (req: AuthRequest, res: Response, next: NextFunction) => {
   await service.deleteMe(req.user._id);
    res.status(204).json({status: 'success', data: null});
})

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const createdUser = await UserDbModel.create({
        ...req.body,
        role: req.body.role ?? 'user',
    });

    await writeAuditLog(req as AuthRequest, {
        action: "user.create",
        entityType: "user",
        entityId: String(createdUser._id),
        details: {
            email: createdUser.email,
            role: createdUser.role,
        },
    });

    res.status(201).json({
        status: 'success',
        data: serializeUser(createdUser),
    });
}

export const updateUser = async (req: Request, res: Response) => {
    const payload = filterAdminPayload(req.body);
    const updatedUser = await UserDbModel.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
    });

    if (!updatedUser) {
        throw new HttpError(404, 'Document not found');
    }

    await writeAuditLog(req as AuthRequest, {
        action: "user.update",
        entityType: "user",
        entityId: String(updatedUser._id),
        details: {
            changedFields: Object.keys(payload),
        },
    });

    res.status(200).json({
        status: 'success',
        data: serializeUser(updatedUser),
    });
};

export const deleteUser = async (req: Request, res: Response) => {
    const deletedUser = await UserDbModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
        throw new HttpError(404, 'Document not found');
    }

    await writeAuditLog(req as AuthRequest, {
        action: "user.delete",
        entityType: "user",
        entityId: String(deletedUser._id),
        details: {
            email: deletedUser.email,
            role: deletedUser.role,
        },
    });

    res.status(204).json({ status: 'success', data: null });
};
