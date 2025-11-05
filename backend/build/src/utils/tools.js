import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
export const ah = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
export const convertQuizDtoToQuiz = (dto) => {
    return {
        _id: uuidv4(),
        title: dto.title,
        icon: dto.icon || '',
        description: dto.description,
        questions: dto.questions,
    };
};
export const convertUserDtoToUser = async (dto) => {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return {
        userName: dto.userName,
        email: dto.email,
        passHash: hashedPassword
    };
};
