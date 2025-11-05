import joi from 'joi';
export const UserDtoSchema = joi.object({
    userName: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().alphanum().min(8).required(),
    roles: joi.string().valid('user', 'admin', 'guest').default('user'),
});
export const ChangePassDtoSchema = joi.object({
    id: joi.number().positive().max(999999999).min(100000000),
    newPassword: joi.string().alphanum().min(8).required()
});
export const ChangeDataDtoSchema = joi.object({
    id: joi.number().positive().max(999999999).min(100000000),
    newUserName: joi.string().min(1),
});
const QuestionSchema = joi.object({
    question: joi.string().min(1).required(),
    image: joi.string().uri().optional(),
    options: joi.array().items(joi.string().min(1)).min(2).required(),
    answer: joi.number().integer().min(0).required()
});
export const QuizDtoSchema = joi.object({
    title: joi.string().min(1).required(),
    icon: joi.string().min(1).optional(),
    description: joi.string().min(1).required(),
    questions: joi.array().items(QuestionSchema).min(1).required()
});
export const QuizResultSchema = joi.object({
    points: joi.number().integer().min(0).required(),
    totalQuestions: joi.number().integer().min(1).required()
});
