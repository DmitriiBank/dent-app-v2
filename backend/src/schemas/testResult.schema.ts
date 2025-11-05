import mongoose, {Schema} from "mongoose";

export const testResultSchema = new Schema(
    {
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QuizDbModel",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserDbModel",
            required: true
        },
        points: {type: Number, required: true, min: 0},
        totalQuestions: {type: Number, required: true, min: 1},
        date: {type: Date, default: Date.now},
    },
    {
        timestamps: true
    },
);

testResultSchema.index({quiz: 1, user: 1}, {unique: true});


export const TestResult = mongoose.model('TestResult', testResultSchema);