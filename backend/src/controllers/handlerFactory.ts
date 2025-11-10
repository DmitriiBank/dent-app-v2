import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';
import { HttpError } from '../errorHandler/HttpError';
import { APIFeatures } from '../utils/apiFeatures';

const catchAsync = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  fn(req, res, next).catch(next);
};

export const deleteOne = <T extends Document>(Model: Model<T>) =>
    catchAsync(async (req: Request, res: Response) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw new HttpError(404, 'Document not found');
      res.status(204).json({ status: 'success', data: null });
    });

export const updateOne = <T extends Document>(Model: Model<T>) =>
    catchAsync(async (req: Request, res: Response) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) throw new HttpError(404, 'Document not found');
      res.status(200).json({ status: 'success', data: doc });
    });

export const createOne = <T extends Document>(Model: Model<T>) =>
    catchAsync(async (req: Request, res: Response) => {
      const doc = await Model.create(req.body);
      res.status(201).json({ status: 'success', data: doc });
    });

export const getOne = <T extends Document>(Model: Model<T>, popOptions?: any) =>
    catchAsync(async (req: Request, res: Response) => {
      let query = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);
      const doc = await query;
      if (!doc) throw new HttpError(404, 'Document not found');
      res.status(200).json({ status: 'success', data: doc });
    });

export const getAll = <T extends Document>(Model: Model<T>) =>
    catchAsync(async (req: Request, res: Response) => {
      const features = new APIFeatures(Model.find(), req.query)
          .filter()
          .sort()
          .limitFields()
          .paginate();
      const docs = await features.query;
      res.status(200).json({ status: 'success', results: docs.length, data: docs });
    });
