import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Paths} from "../types/quiz-types.ts";
import {useAppDispatch} from "../redux/hooks.ts";
import {fetchCurrentUser} from "../redux/slices/authSlice.ts";

export default function GoogleSuccess() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function checkAuth() {
            try {
                await new Promise(res => setTimeout(res, 50));
                await dispatch(fetchCurrentUser()).unwrap();
                console.log('✅ Google auth successful');
                navigate(Paths.HOME);
            } catch (error) {
                console.error('❌ Google auth failed:', error);
                navigate(Paths.LOGIN);
            }
        }

      checkAuth();
    }, []);

    return (
        <div style={{
            color: "#fff",
            textAlign: "center",
            padding: "2rem"
        }}>
            <p>Авторизация через Google... 😽</p>
        </div>
    );
}