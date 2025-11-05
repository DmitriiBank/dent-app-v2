import Logout from "../../servicePages/Logout.tsx";
import Box from "@mui/material/Box";
import {Avatar} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useAppSelector} from "../../redux/hooks.ts";
import Button from "@mui/material/Button";
import {Paths} from "../../types/quiz-types.ts";
import {useNavigate} from "react-router-dom";


export const Header = () => {
    const {email, name} = useAppSelector(state => state.auth);
    console.log(email, name)
    const navigate = useNavigate();
    const handleLogin = async () => {
        navigate(Paths.LOGIN)
    }
    return (
        <div className={"header"}>
            <h1>Quiz Dent</h1>
            {!email && (
            <Button variant={'contained'}
                    style={{backgroundColor: 'red', fontWeight: 'bold'}}
                    onClick={handleLogin}
            >Log in</Button>)}
            {email && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: "auto",
                        mr: "15px"
                    }}
                >
                    <Avatar sx={{m: "3px"}}>{(name || email)?.[0]?.toUpperCase()}</Avatar>
                    <Typography
                        sx={{color: "#E5E7EB", mr: 3}}
                    >
                        {name || email}
                    </Typography>
                    <Logout />
                </Box>
            )}

        </div>
    );
};

