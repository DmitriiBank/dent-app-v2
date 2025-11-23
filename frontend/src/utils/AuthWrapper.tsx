import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {fetchCurrentUser} from '../redux/slices/authSlice';

interface AuthWrapperProps {
    children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.data);

    useEffect(() => {
        // Проверяем авторизацию только если пользователь не авторизован
        if (!user ) {
            console.log('🔍 Checking authentication...');
            dispatch(fetchCurrentUser())
                .unwrap()
                .then(() => console.log('✅ User authenticated'))
                .catch(() => console.log('❌ User not authenticated'));
        }
    }, [dispatch, user]);


    return <>{children}</>;
}