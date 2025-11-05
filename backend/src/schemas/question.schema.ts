import mongoose, {Schema} from "mongoose";
import {Question} from "../model/Quiz";


export const questionSchema = new Schema<Question>({
    quiz: {
        type: mongoose.Schema.ObjectId,
        ref: 'QuizDbModel',
        required: [true, 'Question must belong to a quiz'],
    },
    question: {
        type: String,
        required: [true, 'Question cannot be empty'],
    },
    image: {type: String},
    options: {
        type: [String],
        validate: (v: string | any[]) => Array.isArray(v) && v.length >= 2
    },
    answer: {
        type: Number,
        required: [true, 'Question cannot be without an answer'],
    },
}, {
    _id: true,
    timestamps: false,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})


export const QuestionModel = mongoose.model('Question', questionSchema);
