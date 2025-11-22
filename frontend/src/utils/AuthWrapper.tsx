import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchCurrentUser } from '../redux/slices/authSlice';

interface AuthWrapperProps {
    children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const dispatch = useAppDispatch();
    const { isAuth, isLoading } = useAppSelector(state => state.auth);

    useEffect(() => {
        // Проверяем авторизацию только если пользователь не авторизован
        if (!isAuth && !isLoading) {
            console.log('🔍 Checking authentication...');
            dispatch(fetchCurrentUser())
                .unwrap()
                .then(() => console.log('✅ User authenticated'))
                .catch(() => console.log('❌ User not authenticated'));
        }
    }, []); // Выполняется только при монтировании

    return <>{children}</>;
}