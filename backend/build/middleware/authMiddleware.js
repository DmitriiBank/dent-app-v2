"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const user_schema_1 = require("../schemas/user.schema");
const HttpError_1 = require("../errorHandler/HttpError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);
    if (!token) {
        return next(new HttpError_1.HttpError(401, 'You are not logged in! Please log in'));
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    const currentUser = await user_schema_1.UserDbModel.findById(decoded.id);
    if (!currentUser) {
        return next(new HttpError_1.HttpError(401, 'The user belongs to this token does no longer exist!'));
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new HttpError_1.HttpError(401, 'User recently changed password! Please log in again.'));
    }
    req.user = currentUser;
    next();
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new HttpError_1.HttpError(403, 'You do not have permission to perform this action'));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
