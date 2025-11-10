import {Navigate, Outlet} from "react-router-dom";
import { useAppSelector } from "./hooks";


const PrivateRoute = () => {
    const {email, isLoading} = useAppSelector((state) => state.auth);
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
    return email ? <Outlet /> : <Navigate to="/users/login" replace />;
};

export default PrivateRoute;
