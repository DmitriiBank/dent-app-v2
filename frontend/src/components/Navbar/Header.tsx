import Logout from "../../servicePages/Logout";
import Box from "@mui/material/Box";
import { Avatar, Drawer, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useAppSelector} from "../../redux/hooks";
import Button from "@mui/material/Button";
import { Paths } from "../../types/quiz-types";
import { useNavigate } from "react-router-dom";
import {useState, useCallback} from "react";
import { MenuIcon } from "lucide-react";
import { MobileNavbar } from "./Navbar";
import { isAdmin, isTeacher } from "../../utils/permissions.ts";

export const Header = () => {
    const { data} = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const openMenu = useCallback(() => setOpen(true), []);
    const closeMenu = useCallback(() => setOpen(false), []);
    const handleLogin = useCallback(() => navigate(Paths.LOGIN), [navigate]);

    return (
        <div className="header">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <div className="burger">
                    <IconButton aria-label="open navigation" onClick={openMenu} size="large">
                        <MenuIcon />
                    </IconButton>
                </div>

                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Dent-App
                </Typography>
            </Box>

            {!data?.email ? (
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "red", fontWeight: "bold" }}
                    onClick={handleLogin}
                >
                    Log in
                </Button>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 0,
                        gap: 1,
                        ml: "auto",
                        mr: { xs: 0, sm: "15px" },
                    }}
                >
                    {/*<Avatar sx={{ m: "3px" }}>{(name || email)?.[0]?.toUpperCase()}</Avatar>*/}
                    <Avatar
                        src={data?.avatar ?? undefined}
                        sx={{ m: 0, width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, flexShrink: 0 }}
                        imgProps={{ referrerPolicy: "no-referrer" }}
                    >
                        {!data?.avatar &&  data?.name?.[0]?.toUpperCase()}
                    </Avatar>

                    <Typography
                        className="nickName"
                        sx={{
                            color: "#E5E7EB",
                            mr: { sm: 1, md: 3 },
                            fontSize: { sm: 18, md: 20 },
                            cursor: "pointer",
                            maxWidth: { sm: 160, md: 220, lg: 320 },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() =>
                            navigate(
                                isAdmin(data?.role)
                                    ? Paths.ADMIN_CONTENT
                                    : isTeacher(data?.role)
                                        ? Paths.TEACHER_RESULTS
                                        : Paths.MY_PAGE
                            )
                        }
                    >
                        {data?.name || data?.email}
                    </Typography>

                    <Logout />
                </Box>
            )}

            {/* Mobile drawer */}
            <Drawer
                anchor="left"
                open={open}
                onClose={closeMenu}
                BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.5)" } }}
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(21,26,33,0.0)",
                        backdropFilter: "blur(6px)",
                        boxShadow: 6,
                        borderRadius: "0 0 16px 16px",
                        px: 2,
                        py: 2,
                        height: "auto",
                        maxHeight: "80vh",
                    },
                }}
            >
                <MobileNavbar />
            </Drawer>
        </div>
    );
};
