import {Navigate} from "react-router-dom";
import { useAppSelector } from "./hooks";


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { email, isLoading } = useAppSelector((state) => state.auth);

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

    return email ? children : <Navigate to="/users/login" replace />;
};

export default PrivateRoute;
