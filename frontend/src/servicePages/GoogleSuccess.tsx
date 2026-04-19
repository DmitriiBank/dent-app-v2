import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../redux/hooks.ts";
import {fetchCurrentUser} from "../redux/slices/authSlice.ts";
import {Paths} from "../types/quiz-types.ts";

export default function GoogleSuccess() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();


    useEffect(() => {
        async function checkAuth() {
            try {
                await dispatch(fetchCurrentUser()).unwrap();
                navigate(Paths.HOME);
            } catch {
                navigate(Paths.LOGIN);
            }
        }

        checkAuth();
    }, [dispatch, navigate]);

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
