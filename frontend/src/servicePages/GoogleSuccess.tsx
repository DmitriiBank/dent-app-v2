import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Paths} from "../types/quiz-types.ts";
import {useAppDispatch} from "../redux/hooks.ts";
import {fetchCurrentUser} from "../redux/slices/authSlice.ts";

export default function GoogleSuccess() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    useEffect(() => {
        async function checkAuth() {
            try {
                // Небольшая задержка, чтобы cookies успели установиться
                await new Promise(resolve => setTimeout(resolve, 500));

                await dispatch(fetchCurrentUser()).unwrap();
                console.log('✅ Google auth successful');
                navigate(Paths.HOME);
            } catch (error) {
                console.error('❌ Google auth failed:', error);

                // Пробуем повторить запрос
                if (retryCount < MAX_RETRIES) {
                    console.log(`Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                    setRetryCount(prev => prev + 1);
                    setTimeout(() => {
                        checkAuth();
                    }, 1000);
                } else {
                    // После всех попыток перенаправляем на страницу ошибки
                    navigate(Paths.ERROR, {
                        state: {
                            message: 'Не удалось авторизоваться через Google. Попробуйте снова.'
                        }
                    });
                }
            }
        }

        checkAuth();
    }, []); // Убираем зависимости, чтобы не было повторных вызовов

    return (
        <div style={{
            color: "#fff",
            textAlign: "center",
            padding: "2rem"
        }}>
            <p>Авторизация через Google... 😽</p>
            {retryCount > 0 && (
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    Попытка {retryCount}/{MAX_RETRIES}
                </p>
            )}
        </div>
    );
}