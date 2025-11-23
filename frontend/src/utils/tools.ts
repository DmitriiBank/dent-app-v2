
import type {UserDto} from "../types/User.ts";

export const convertUserDtoToUser = async (dto: UserDto) => {

    const name = `${dto.first_name} ${dto.last_name}`.trim();
    return {
        name,
        email: dto.email,
        password: dto.password,
        passwordConfirm: dto.passwordConfirm
    }
}