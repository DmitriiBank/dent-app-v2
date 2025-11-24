import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {fetchCurrentUser} from '../redux/slices/authSlice';

interface AuthWrapperProps {
    children: React.ReactNode;
}

export default function AuthWrapper({children}: AuthWrapperProps) {
    const dispatch = useAppDispatch();
    const {isLoading, initialized} = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
            async function checkAuth() {
                try {
                    if (!initialized) {
                        await dispatch(fetchCurrentUser()).unwrap();
                    }
                } catch {
                    console.error("❌ auth failed");
                }
            }
        checkAuth()
        }, [dispatch, initialized]);

    if (!initialized || isLoading) {
        return (
            <p style={{color: "#fff", textAlign: "center"}}>
                Checking authentication...
            </p>
        );
    }


    return <>{children}</>;
}