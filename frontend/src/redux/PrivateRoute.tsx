import {Navigate, useLocation} from "react-router-dom";
import { useAppSelector } from "./hooks";
import {Paths, Roles} from "../types/quiz-types.ts";

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles?: Roles[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
    const location = useLocation();
    const { data, isLoading, initialized } = useAppSelector((state) => state.auth);

    if (!initialized || isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!data?.email) {
        return <Navigate to={Paths.LOGIN} replace state={{ from: location.pathname }} />;
    }

    if (allowedRoles?.length && (!data?.role || !allowedRoles.includes(data?.role as Roles))) {
        return <Navigate to={Paths.ERROR} replace />;
    }

    return children;
};

export default PrivateRoute;
