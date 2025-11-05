import { UserDbModel } from '../validators/user.schema.js';
import { HttpError } from '../errorHandler/HttpError.js';
import * as factory from './HandlerFactory.js';
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};
export const getAllUsers = async (req, res) => {
    const users = await UserDbModel.find();
    // .populate('testResults');
    res.status(201).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
};
export const updateMe = async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new HttpError(400, 'This route is not for password update. Please use /updateMyPassword'));
    }
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await UserDbModel.findByIdAndUpdate(req.user.id, filteredBody, {
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
export const deleteMe = async (req, res, next) => {
    await UserDbModel.findByIdAndUpdate(req.user.id, { active: false });
    res.status(200).json({
        status: 'success',
        data: null,
    });
};
export const getUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'No tours with this id',
    });
};
export const updateUser = factory.updateOne(UserDbModel);
export const deleteUser = factory.deleteOne(UserDbModel);
// export const addTestResult = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//         const { quizId, points, totalQuestions } = req.body;
//
//         if (!quizId || points === undefined || totalQuestions === undefined) {
//             return next(new HttpError(400, "Missing quizId, points or totalQuestions"));
//         }
//
//         const user = await UserDbModel.findById(req.user.id);
//         if (!user) return next(new HttpError(404, "User not found"));
//
//         const testResults = await user.addResult(new mongoose.Types.ObjectId(quizId), points, totalQuestions);
//
//         res.status(200).json({
//             status: "success",
//             message: "Result added successfully",
//             data: { testResults },
//         });
//     } catch (err) {
//         next(err);
//     }
// };
