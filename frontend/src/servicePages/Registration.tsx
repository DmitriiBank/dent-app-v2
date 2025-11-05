import SignUp from "../templates/SignUp.tsx";
import {useState} from "react";
import type {UserDto} from "../types/User.ts";
import {register} from "../services/authApi.ts";

const Registration = () => {
    const [errorCode, setErrorCode] = useState<string | null>(null);


    const handleRegister = async (data: UserDto): Promise<void> => {
        try {
            const result = await register(data);
            if (!result.email) throw new Error('Ошибка регистрации');
        } catch (err) {
            console.error(err);
            setErrorCode('default');
        }
    };

    return (
        <div>
            <SignUp
                submitFunc={handleRegister}
                serverErrorKey={errorCode}
            />
        </div>
    );
};

export default Registration;