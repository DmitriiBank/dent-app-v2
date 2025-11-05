import mongoose from "mongoose";
export const questionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.ObjectId,
        ref: 'QuizDbModel',
        required: [true, 'Question must belong to a quiz'],
    },
    question: {
        type: String,
        required: [true, 'Question cannot be empty'],
    },
    image: { type: String },
    options: {
        type: [String],
        validate: (v) => Array.isArray(v) && v.length >= 2
    },
    answer: { type: Number, required: [true, 'Question cannot be without an answer'], },
}, {
    _id: true,
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
export const QuestionModel = mongoose.model('Question', questionSchema);
