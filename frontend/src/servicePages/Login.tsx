import SignIn from "../templates/SignIn.tsx";
import {loginUser} from "../redux/slices/authSlice";
import {useNavigate} from "react-router-dom";
import {type LoginData, Paths} from "../types/quiz-types.ts";
import {useAppDispatch} from "../redux/hooks.ts";
import {useState} from "react";


const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const loginWithServer = async (loginData: LoginData) => {
            if (loading) return;
            setLoading(true);
            setError(null);

        try {
            const user = await dispatch(loginUser(loginData)).unwrap();
            if (user) {
                navigate(Paths.HOME);
            } else {
                setError("Ошибка авторизации");
                throw new Error("Ошибка авторизации");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.message.includes("429")) {
                    setError("Слишком много попыток входа 😿 Подожди минутку и попробуй снова.");
                } else {
                    setError("Ошибка авторизации. Проверь логин или пароль.");
                }
            } else {
                setError("Что-то пошло не так...");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={'login'}>
            <SignIn submitFn={loginWithServer} loginError={error}
                    loading={loading} />
        </div>
    );
};

export default Login;
