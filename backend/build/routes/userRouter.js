"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("../controllers/userController"));
const authController = __importStar(require("../controllers/authController"));
const authService = __importStar(require("../middleware/authMiddleware"));
exports.userRouter = express_1.default.Router();
exports.userRouter.post('/signup', authController.signup);
exports.userRouter.post('/login', authController.login);
exports.userRouter.post('/forgotPassword', authController.forgotPassword);
exports.userRouter.post('/resetPassword/:token', authController.resetPassword);
exports.userRouter.use(authService.protect);
exports.userRouter.patch('/updatePassword', authController.updatePassword);
exports.userRouter.get('/me', userController.getMe, userController.getUserById);
exports.userRouter.patch('/updateMe', userController.updateMe);
exports.userRouter.delete('/deleteMe', userController.deleteMe);
exports.userRouter.use(authService.restrictTo('admin'));
exports.userRouter
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
exports.userRouter
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
