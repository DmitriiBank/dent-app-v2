import {Request, Response, NextFunction} from 'express';
import {Model, Document} from 'mongoose';
import {
    applServiceImplMongo as service
} from "../services/ApplServiceImplMongo.js";


export const deleteOne = <T extends Document>(Model: Model<T>) =>
   async (req: Request, res: Response) => {
        await service.deleteOne(Model, req.params.id);
        res.status(204).json({status: 'success', data: null});
    };

export const updateOne = <T extends Document>(Model: Model<T>) =>
    async (req: Request, res: Response) => {
        const doc = await service.updateOne(Model, req.params.id, req.body)
        res.status(200).json({status: 'success', data: doc});
    };

export const createOne = <T extends Document>(Model: Model<T>) =>
    async (req: Request, res: Response) => {
    const doc = await service.createOne(Model, req.body);
        res.status(201).json({status: 'success', data: doc});
    };

export const getOne =
    <T extends Document>(Model: Model<T>, popOptions?: any) =>
        async (req: Request, res: Response) => {
            const doc = await service.getOne(Model, req.params.id, popOptions);
            res.status(200).json({status: 'success', data: doc});
        };

export const getAll =
    <T extends Document>(Model: Model<T>) =>
        async (req: Request, res: Response): Promise<void> => {
            const docs = await service.getAll(Model, req.query);
            res.status(200).json({
                status: 'success',
                results: docs.length,
                data: docs,
            });

        };
