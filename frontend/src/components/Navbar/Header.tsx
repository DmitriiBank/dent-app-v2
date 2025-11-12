import Logout from "../../servicePages/Logout.tsx";
import Box from "@mui/material/Box";
import {Avatar, Drawer,
    IconButton,} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useAppSelector} from "../../redux/hooks.ts";
import Button from "@mui/material/Button";
import {Paths} from "../../types/quiz-types.ts";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Navbar} from "./Navbar.tsx";
import {MenuIcon} from "lucide-react";
import {getAllUsers} from "../../services/accountApi.ts";

export const Header = () => {
    const {email, name, role} = useAppSelector(state => state.auth);
    console.log(email, name)
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleLogin = async () => {
        navigate(Paths.LOGIN)
    }
    return (
        <div className={"header"}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                <div className={'burger'}>
                    <IconButton
                        aria-label="open navigation"
                        onClick={() => setOpen(true)}
                        edge="start"
                        size="large"
                    >
                        <MenuIcon />
                    </IconButton>
                </div>


                <Typography
                    variant="h5"
                    sx={{fontWeight: 700}}
                >
                    Quiz Dent
                </Typography>
            </Box>
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
                            sx={{color: "#E5E7EB", mr: 3, fontSize: 20, cursor: "pointer",
                                "&:hover": {
                                    textDecoration: "underline",
                                },}}
                            onClick={() =>{
                                role == 'admin' ?  navigate(Paths.ALL_USERS) :
                                navigate(Paths.MY_PAGE)
                            }}
                        >
                        {name || email}
                    </Typography>
                    <Button variant={'contained'}
                            style={{backgroundColor: 'red', fontWeight: 'bold'}}
                            onClick={() => {
                              const users =  getAllUsers()
                                console.log(users)
                            }}
                        >Users</Button>
                    <Logout />
                </Box>
            )}
            <Drawer
                anchor="left"
                open={open}
                onClose={() => setOpen(false)}
                BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.5)" } }} // полупрозрачный фон за меню
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(21,26,33,0.0)",
                        backdropFilter: "blur(6px)",
                        boxShadow: 6,
                        borderRadius: "0 0 16px 16px",
                        px: 2,
                        py: 2,
                        // для top-Drawer управляем высотой:
                        height: "auto",
                        maxHeight: "80vh",
                    },
                }}
            >
                <Box sx={{ p: 2, display: "block" }} className="navbar--drawer">
                    <Navbar />
                </Box>
            </Drawer>

        </div>
    );
};

