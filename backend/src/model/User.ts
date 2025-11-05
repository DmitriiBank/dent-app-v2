import mongoose, {Document} from "mongoose";


export interface User extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    role: string;
    password: string;
    passwordConfirm?: string;
    passwordChangedAt?: Date | null;
    passwordResetToken?: string | null;
    passwordResetExpires?: Date | null;
    active: boolean;
    correctPassword(candidate: string, userPassword: string): Promise<boolean>;
    changedPasswordAfter(JWTTimestamp: number): boolean;
    createPasswordResetToken(): string;
    addResult(quizId: mongoose.Types.ObjectId, points: number, totalQuestions: number): Promise<void>;
}
