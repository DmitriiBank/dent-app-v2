"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.getOne = exports.createOne = exports.updateOne = exports.deleteOne = void 0;
const HttpError_1 = require("../errorHandler/HttpError");
const apiFeatures_1 = require("../utils/apiFeatures");
const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};
const deleteOne = (Model) => catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
        throw new HttpError_1.HttpError(404, 'Document not found');
    res.status(204).json({ status: 'success', data: null });
});
exports.deleteOne = deleteOne;
const updateOne = (Model) => catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc)
        throw new HttpError_1.HttpError(404, 'Document not found');
    res.status(200).json({ status: 'success', data: doc });
});
exports.updateOne = updateOne;
const createOne = (Model) => catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ status: 'success', data: doc });
});
exports.createOne = createOne;
const getOne = (Model, popOptions) => catchAsync(async (req, res) => {
    let query = Model.findById(req.params.quizId);
    if (popOptions)
        query = query.populate(popOptions);
    const doc = await query;
    if (!doc)
        throw new HttpError_1.HttpError(404, 'Document not found');
    res.status(200).json({ status: 'success', data: doc });
});
exports.getOne = getOne;
const getAll = (Model) => catchAsync(async (req, res) => {
    const features = new apiFeatures_1.APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const docs = await features.query;
    res.status(200).json({ status: 'success', results: docs.length, data: docs });
});
exports.getAll = getAll;
