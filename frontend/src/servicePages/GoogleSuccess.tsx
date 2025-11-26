import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {fetchCurrentUser} from "../redux/slices/authSlice.ts";
import {Paths} from "../types/quiz-types.ts";
import {useAppDispatch} from "../redux/hooks.ts";

export default function GoogleSuccess() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();


    useEffect(() => {
        async function checkAuth() {
            const code = new URLSearchParams(window.location.search).get("code");

            if (!code) {
                console.error("❌ No Google code received");
                navigate(Paths.LOGIN);
                return;
            }

            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/google`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                });

                if (!res.ok) throw new Error("Google login failed");

                await dispatch(fetchCurrentUser()).unwrap();
                console.log("✅ Google auth successful");
                navigate(Paths.HOME);
            } catch (error) {
                console.error("❌ Google auth failed:", error);
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