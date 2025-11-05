import { HttpError } from '../errorHandler/HttpError.js';
export const deleteOne = (Model) => async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        throw new HttpError(404, 'No docs found with id.');
    }
    res.status(201).json({
        status: 'success',
        data: null,
    });
};
export const updateOne = (Model) => async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        throw new HttpError(404, 'No docs found with id.');
    }
    res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
};
