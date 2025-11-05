import SignIn from "../templates/SignIn.tsx";
import {loginUser} from "../redux/slices/authSlice";
import {useNavigate} from "react-router-dom";
import {type LoginData, Paths} from "../types/quiz-types.ts";
import {useAppDispatch} from "../redux/hooks.ts";


const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loginWithServer = async (loginData: LoginData) => {
        try {

            const action = await dispatch(loginUser(loginData))

            if (loginUser.fulfilled.match(action)) {
                const user = action.payload;

                console.log("✅ Вход выполнен:", user.name);
                navigate(Paths.HOME);
            } else {
                throw new Error("Ошибка авторизации");
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    }


    return (
        <div className={'login'}>
            <SignIn submitFn={loginWithServer} />
        </div>
    );
};

export default Login;