import {Navigate, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "./hooks";
import {Paths, Roles} from "../types/quiz-types.ts";
import {useEffect} from "react";
import {fetchCurrentUser} from "./slices/authSlice.ts";

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles?: readonly Roles[];
}

const PrivateRoute = ({children, allowedRoles}: PrivateRouteProps) => {
    const location = useLocation();
    const {
        data,
        isLoading,
        initialized
    } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    useEffect(() => {
        async function checkAuth() {
            try {
                if (!initialized) {
                    await dispatch(fetchCurrentUser()).unwrap();
                }
            } catch {}
        }

        checkAuth()
    }, [dispatch, initialized]);

    if (!initialized || isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                <div>Loading...</div>
            </div>
        );
    }

    if (!data?.email) {
        return <Navigate
            to={Paths.LOGIN}
            replace
            state={{from: location.pathname}}
        />;
    }

    if (allowedRoles?.length && (!data?.role || !allowedRoles.includes(data?.role as Roles))) {
        return <Navigate
            to={Paths.ERROR}
            replace
        />;
    }

    return children;
};

export default PrivateRoute;
