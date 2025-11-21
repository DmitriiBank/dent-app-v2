import SignUp from "../templates/SignUp.tsx";
import {useState} from "react";
import type {GetUserResponseData, UserDto} from "../types/User.ts";
import {register} from "../services/authApi.ts";
import {useAppDispatch} from "../redux/hooks.ts";
import {useNavigate} from "react-router-dom";
import {fetchCurrentUser} from "../redux/slices/authSlice.ts";
import {Paths} from "../types/quiz-types.ts";

const Registration = () => {
    const [errorCode, setErrorCode] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleRegister = async (data: UserDto): Promise<void> => {
        try {
            const user = await register(data) as GetUserResponseData;
            if (!user.data.email) throw new Error('Ошибка регистрации');
            await dispatch(fetchCurrentUser()).unwrap();
            navigate(Paths.HOME);
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