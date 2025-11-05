import { Schema, model } from 'mongoose';
const answerSchema = new Schema({
    questionId: { type: Schema.Types.ObjectId, required: true },
    selectedIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    pointsAwarded: { type: Number, required: true, min: 0 }
}, { _id: false });
const attemptSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    answers: { type: [answerSchema], default: [] },
    score: { type: Number, default: 0 },
}, { timestamps: true });
attemptSchema.index({ user: 1, quiz: 1, createdAt: -1 });
export const AttemptModel = model('Attempt', attemptSchema);
