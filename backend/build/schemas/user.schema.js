"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDbModel = exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const quizTypes_1 = require("../utils/quizTypes");
const crypto_1 = __importDefault(require("crypto"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.userSchema = new mongoose_1.Schema({
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
        validate: [validator_1.default.isEmail, 'Please provide a valid email'],
    },
    role: {
        type: String,
        enum: Object.values(quizTypes_1.Roles),
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
            validator: function (el) {
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
}, {
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
exports.userSchema.virtual('testResults', {
    ref: 'TestResult',
    foreignField: 'user',
    localField: '_id',
});
exports.userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});
exports.userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});
exports.userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});
exports.userSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'testResults',
        select: 'points totalQuestions date quiz -user',
    });
    next();
});
exports.userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcryptjs_1.default.compare(candidatePassword, userPassword);
};
exports.userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = ((this.passwordChangedAt.getTime() / 1000), 10);
        //console.log('Password changed at:', changedTimeStamp, 'JWT issued at:', JWTTimestamp);
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
};
exports.userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
exports.UserDbModel = mongoose_1.default.model('User', exports.userSchema);
