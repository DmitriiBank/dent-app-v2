import {useState} from 'react';
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {useNavigate} from "react-router-dom";
import {logoutUser} from "../redux/slices/authSlice";
import {Paths} from "../types/quiz-types";
import {useAppDispatch} from "../redux/hooks.ts";


const Logout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await dispatch(logoutUser()).unwrap();
            navigate(Paths.LOGIN);
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
                startIcon={isLoading ? <CircularProgress
                    size={20}
                    color="inherit"
                /> : null}
            >
                {isLoading ? 'Exit...' : 'Exit'}
            </Button>
        </div>
    );
};

export default Logout;