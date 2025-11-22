import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCurrentUser } from '../redux/slices/authSlice';
import {useNavigate} from "react-router-dom";
import {Paths} from "../types/quiz-types.ts";

interface AuthWrapperProps {
    children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuth, isLoading, data } = useAppSelector(state => state.auth);

    useEffect(() => {
        // Проверяем авторизацию только если пользователь не авторизован
        if (!isAuth ) {
            console.log('🔍 Checking authentication...');
            dispatch(fetchCurrentUser())
                .unwrap()
                .then(() => console.log('✅ User authenticated'))
                .catch(() => console.log('❌ User not authenticated'));
        }
    }, [dispatch, isAuth]);

    useEffect(() => {
        if (isAuth && !data) {
            navigate(Paths.LOGIN)
        }
    }, [data, isAuth, navigate])

    if(isLoading){
        return <p style={{color: "#fff", textAlign: "center"}}>Checking auth...</p>
    }

    return <>{children}</>;
}