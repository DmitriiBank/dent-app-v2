import SignUp from "../templates/SignUp.tsx";
import {useState} from "react";
import type { UserDto} from "../types/User.ts";
import {useAppDispatch} from "../redux/hooks.ts";
import {useNavigate} from "react-router-dom";
import {signupUser} from "../redux/slices/authSlice.ts";
import {Paths} from "../types/quiz-types.ts";

const Registration = () => {
    const [errorCode, setErrorCode] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleRegister = async (data: UserDto): Promise<void> => {
        try {
            const user = await dispatch(signupUser(data)).unwrap();
            if (!user.email) throw new Error('Ошибка регистрации');
            // await dispatch(fetchCurrentUser()).unwrap();
            navigate(Paths.LOGIN);
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