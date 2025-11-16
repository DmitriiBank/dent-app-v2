import {Navigate, useLocation} from "react-router-dom";
import { useAppSelector } from "./hooks";
import {Paths, Roles} from "../types/quiz-types.ts";

interface PrivateRouteProps {
    children: React.ReactNode;
    allowedRoles?: Roles[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
    const location = useLocation();
    const { email, role, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading) {
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

    if (!email) {
        return <Navigate to={Paths.LOGIN} replace state={{ from: location.pathname }} />;
    }

    if (allowedRoles?.length && (!role || !allowedRoles.includes(role as Roles))) {
        return <Navigate to={Paths.ERROR} replace />;
    }

    return children;
};

export default PrivateRoute;
