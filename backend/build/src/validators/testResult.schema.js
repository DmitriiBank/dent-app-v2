import mongoose, { Schema } from "mongoose";
export const testResultSchema = new Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    points: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 1 },
    date: { type: Date, default: Date.now },
});
export const TestResult = mongoose.model('TestResult', testResultSchema);
