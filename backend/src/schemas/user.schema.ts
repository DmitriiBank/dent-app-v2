import mongoose, {Schema, Query} from "mongoose";
import {Roles} from "../utils/quizTypes";
import crypto from 'crypto';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import {User} from "../model/User";


export const userSchema = new Schema<User>(
    {
        name: {
            type: String,
            required: [true, 'PLease tell us your name'],
            trim: true,
            maxlength: [100, 'User must have at less or equal then 100 characters'],
            minlength: [1, 'User must have at more or equal then 1 characters'],
            validate: {
                validator: function (val) {
                    return /^[\p{L}\s]+$/u.test(val);
                },
                message: 'Name must contain only letters and spaces',
            },
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            trim: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        role: {
            type: String,
            enum: Object.values(Roles),
            default: 'user',
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [8, 'Password must be more or equal then 8 characters'],
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your a password'],
            validate: {
                validator: function (el: string) {
                    return el === this.password;
                },
                message: 'Passwords are not the same',
            },
        },
        passwordChangedAt: { type: Date },
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false,
        }
    },
    {
        id: false,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    },
);

userSchema.virtual('testResults', {
    ref: 'TestResult',
    foreignField: 'user',
    localField: '_id',
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = new Date(Date.now() - 1000);
    next()
})

userSchema.pre<Query<User[], User>>(/^find/, function (next) {
    this.find({active: {$ne: false}});
    next();
})

userSchema.pre(/^find/, function (this: Query<any, any>, next) {
    (this as any).populate({
        path: 'testResults',
        select: 'points totalQuestions date quiz -user',
    });
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);

}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = ((this.passwordChangedAt.getTime() / 1000), 10);

        //console.log('Password changed at:', changedTimeStamp, 'JWT issued at:', JWTTimestamp);
        return JWTTimestamp < changedTimeStamp;
    }
    return false
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

export const UserDbModel = mongoose.model<User>('User', userSchema);
