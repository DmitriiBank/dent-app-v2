import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAppDispatch} from "../redux/hooks.ts";
import {fetchCurrentUser} from "../redux/slices/authSlice.ts";
import {setTokens} from "../services/tokenService.ts";
import {Paths} from "../types/quiz-types.ts";

export default function GoogleSuccess() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();


    useEffect(() => {
        async function checkAuth() {
            try {
                const accessToken = searchParams.get('accessToken');
                const refreshToken = searchParams.get('refreshToken');

                if (accessToken && refreshToken) {
                    console.log(accessToken, refreshToken);
                    await setTokens({ accessToken, refreshToken });
                }

                await dispatch(fetchCurrentUser()).unwrap();
                console.log('✅ Google auth successful');
                navigate(Paths.HOME);
            } catch (error) {
                console.error('❌ Google auth failed:', error);
                navigate(Paths.LOGIN);
            }
        }

        checkAuth();
    }, [dispatch, navigate, searchParams]);

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