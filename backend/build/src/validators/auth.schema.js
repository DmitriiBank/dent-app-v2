import mongoose from "mongoose";
import { Roles } from "../utils/quizTypes.js";
const testResultSchema = new mongoose.Schema({
    points: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 1 },
}, { _id: false });
export const userMongooseSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true, index: true },
    userName: { type: String, required: true, trim: true },
    passHash: { type: String, required: true },
    role: { type: String, enum: Object.values(Roles), required: true, default: Roles.USER },
    testList: { type: Map, of: testResultSchema, default: {} }
}, { timestamps: true });
export const UserDbModel = mongoose.model('User', userMongooseSchema, 'user_collection');
