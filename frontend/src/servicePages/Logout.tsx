import Button from "@mui/material/Button";
import {useDispatch} from "react-redux";
import {logout} from "../redux/slices/authSlice.ts";
import {useNavigate} from "react-router-dom";
import {exit} from "../services/authApi.ts"
import {Paths} from "../types/quiz-types.ts";


const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        alert("Are you sure?")
        dispatch(logout());
        await exit();
        navigate(Paths.HOME)
    }

    return (
        <div>
            <Button variant={'contained'}
                    style={{backgroundColor: 'red', fontWeight: 'bold'}}
                    onClick={handleLogout}
            >Exit</Button>
        </div>
    );
};

export default Logout;