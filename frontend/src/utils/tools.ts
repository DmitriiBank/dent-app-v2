import type {SignupData} from "../types/quiz-types.ts";

export const convertUserDtoToUser = async (dto: SignupData) => {

    const name = `${dto.first_name} ${dto.last_name}`.trim();
    return {
        name,
        email: dto.email,
        password: dto.password,
        passwordConfirm: dto.passwordConfirm
    }
}