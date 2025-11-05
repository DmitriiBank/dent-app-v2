import mongoose from "mongoose";
export const quizSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true, trim: true, index: true },
    icon: { type: String, trim: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
quizSchema.virtual('questions', {
    ref: 'Question',
    foreignField: 'quiz',
    localField: '_id',
});
quizSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'questions',
        select: '-__v',
    });
    next();
});
export const QuizDbModel = mongoose.model('Quiz', quizSchema, 'quiz_collection');
