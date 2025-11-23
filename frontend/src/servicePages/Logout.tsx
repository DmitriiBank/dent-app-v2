import { useState } from 'react';
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import {logout} from "../redux/slices/authSlice";
import { Paths } from "../types/quiz-types";

const Logout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            dispatch(logout());
            console.log('✅ Logout successful');

            navigate(Paths.HOME);
        } catch (error) {
            console.error('❌ Logout failed:', error);
            navigate(Paths.HOME);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Button
                variant="contained"
                style={{
                    backgroundColor: isLoading ? '#ccc' : 'red',
                    fontWeight: 'bold'
                }}
                onClick={handleLogout}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {isLoading ? 'Выход...' : 'Exit'}
            </Button>
        </div>
    );
};

export default Logout;