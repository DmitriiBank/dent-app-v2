import mongoose, {Schema, Query} from "mongoose";
import {Quiz} from "../model/Quiz.js";

export const quizSchema = new Schema<Quiz>({
    title: {type: String, required: true, trim: true, index: true},
    description: {type: String, required: true},
    icon: {type: String, trim: true},
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})

quizSchema.virtual('questions', {
    ref: 'Question',
    foreignField: 'quiz',
    localField: '_id',
})

quizSchema.index({title: 1, description: 1}, {unique: true})

quizSchema.pre(/^find/, function (this: Query<any, any>, next) {
    this.sort({ title: 1 });
    next();
});


quizSchema.pre(/^findOne/, function (this: Query<any, any>, next) {
    this.populate({
        path: 'questions',
        select: '-__v',
    });
    next();
});


export const QuizDbModel = mongoose.model('Quiz', quizSchema, 'quiz_collection')
