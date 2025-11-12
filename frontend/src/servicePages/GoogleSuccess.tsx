import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Paths} from "../types/quiz-types.ts";
import {useAppDispatch} from "../redux/hooks.ts";

export default function GoogleSuccess() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        console.log("🐾 TOKEN:", token);

        if (token) {
            localStorage.setItem("token", token);
            navigate(Paths.HOME);
        } else {
            navigate(Paths.ERROR);
        }
    }, [dispatch, navigate]);

    return (
        <p style={{ color: "#fff", textAlign: "center" }}>
            Авторизация через Google... 😽
        </p>
    );
}
