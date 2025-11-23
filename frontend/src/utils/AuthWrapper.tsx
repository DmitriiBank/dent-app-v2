import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {fetchCurrentUser} from '../redux/slices/authSlice';

interface AuthWrapperProps {
    children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const dispatch = useAppDispatch();
    const { data: isLoading,  initialized } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        // Делаем запрос ТОЛЬКО при первой загрузке
        if (!initialized) {
            dispatch(fetchCurrentUser());
        }
    }, [initialized]);

    // Ждем, пока authSlice полностью проверит куку
    if (!initialized || isLoading) {
        return (
            <p style={{ color: "#fff", textAlign: "center" }}>
                Checking authentication...
            </p>
        );
    }


    return <>{children}</>;
}