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
                await dispatch(fetchCurrentUser()).unwrap();
                navigate(Paths.HOME);
            } catch {
                navigate(Paths.ERROR);
            }
        }

        checkAuth();
    }, [dispatch, navigate]);


    return (
        <p style={{ color: "#fff", textAlign: "center" }}>
            Авторизация через Google... 😽
        </p>
    );
}
