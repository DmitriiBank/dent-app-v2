import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import {alpha, styled} from '@mui/material/styles';
import {ArrowRight, Lock, Mail, Sparkles} from 'lucide-react';
import {GoogleIcon} from './CustomIcons.tsx';
import {type LoginData, Paths} from "../types/quiz-types.ts";
import {NavLink} from "react-router-dom";
import {CircularProgress} from "@mui/material";



export const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2.5),
    margin: 'auto',
    borderRadius: 24,
    backdropFilter: 'blur(10px)',
    background:
        theme.palette.mode === 'dark'
            ? alpha('#0B1220', 0.6)
            : alpha('#151A21', 0.65),
    border: `1px solid ${
        theme.palette.mode === 'dark'
            ? alpha('#8AB4F8', 0.18)
            : alpha('#1976d2', 0.25)
    }`,
    boxShadow:
        theme.palette.mode === 'dark'
            ? '0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(21,26,33,0.04)'
            : '0 20px 60px rgba(25,118,210,0.20), inset 0 1px 0 rgba(255,255,255,0.5)',
    [theme.breakpoints.up('sm')]: {maxWidth: 520},
}));

type Props = { submitFn: (loginData: LoginData) => void };

export const SignInContainer = styled(Stack)(({theme}) => ({
    position: 'relative',
    minHeight: '350px',
    minWidth: '450px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {padding: theme.spacing(4)},
    '&::before': {
        content: '""',
        position: 'fixed',
        inset: 0,
        zIndex: -2,
        background:
            theme.palette.mode === 'dark'
                ? 'radial-gradient(1200px 800px at 10% 10%, rgba(25,118,210,0.35), transparent 60%), radial-gradient(1000px 700px at 90% 90%, rgba(99,102,241,0.35), transparent 60%), linear-gradient(180deg,#0b1120,#0f172a)'
                : 'radial-gradient(1200px 800px at 10% 10%, rgba(25,118,210,0.18), transparent 60%), radial-gradient(1000px 700px at 90% 90%, rgba(99,102,241,0.18), transparent 60%), linear-gradient(180deg,#eef2ff,#ffffff)',
    },
    '&::after': {
        content: '""',
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background:
            theme.palette.mode === 'dark'
                ? 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'1\' height=\'1\' fill=\'%231976d21a\'/%3E%3C/svg%3E")'
                : 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'1\' height=\'1\' fill=\'%231976d20d\'/%3E%3C/svg%3E")',
        opacity: 0.6,
    },
}));

const PrimaryButton = styled(Button)(({theme}) => ({
    height: 52,
    borderRadius: 14,
    fontWeight: 800,
    textTransform: 'none',
    letterSpacing: 0.2,
    backgroundImage:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg,#1976d2 0%,#7c4dff 100%)'
            : 'linear-gradient(135deg,#1976d2 0%,#6ea8fe 100%)',
    boxShadow:
        theme.palette.mode === 'dark'
            ? '0 10px 30px rgba(25,118,210,0.35)'
            : '0 10px 24px rgba(25,118,210,0.25)',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow:
            theme.palette.mode === 'dark'
                ? '0 16px 36px rgba(25,118,210,0.45)'
                : '0 16px 30px rgba(25,118,210,0.35)',
    },
    transition: 'all .18s ease',
}));

const OutlineButton = styled(Button)(({theme}) => ({
    height: 48,
    borderRadius: 14,
    textTransform: 'none',
    fontWeight: 700,
    borderColor:
        theme.palette.mode === 'dark'
            ? alpha('#8AB4F8', 0.35)
            : alpha('#1976d2', 0.4),
    '&:hover': {
        borderColor:
            theme.palette.mode === 'dark'
                ? alpha('#8AB4F8', 0.55)
                : alpha('#1976d2', 0.7),
        backgroundColor:
            theme.palette.mode === 'dark'
                ? alpha('#1976d2', 0.08)
                : alpha('#1976d2', 0.06),
    },
}));

export default function SignIn(props: Props) {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            if (emailError || passwordError) return;
            if (!validateInputs()) return;

            const data = new FormData(event.currentTarget);

            await props.submitFn({
                email: data.get("email") as string,
                password: data.get("password") as string,
            });
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
        return isValid;
    };

    return (
        <SignInContainer
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                spacing={2}
                alignItems="center"
                sx={{mb: 3}}
            >
                <Sparkles
                    size={28}
                    color="#6ea8fe"
                />
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        fontWeight: 900,
                        letterSpacing: 0.2,
                        textAlign: 'center',
                        textShadow: '0 2px 20px rgba(25,118,210,0.35)',
                        color: '#E5E7EB',
                    }}
                >
                    Welcome back
                </Typography>
                <Typography sx={{color: '#E5E7EB', textAlign: 'center'}}>
                    Sign in to continue to your quizzes
                </Typography>
            </Stack>

            <Card variant="outlined">
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2.25
                    }}
                >
                    <FormControl>
                        <FormLabel
                            htmlFor="email"
                            sx={{color: '#E5E7EB'}}
                        >Email</FormLabel>
                        <TextField
                            error={emailError}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            fullWidth
                            variant="outlined"
                            color={emailError ? 'error' : 'secondary'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Mail
                                            size={18}
                                            color='#E5E7EB'
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            sx={(theme) => ({
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 14,
                                    transition: 'box-shadow .18s ease, transform .18s ease',
                                    '& fieldset': {borderColor: alpha(theme.palette.primary.main, 0.25)},
                                    '&:hover fieldset': {borderColor: theme.palette.primary.main},
                                    '&.Mui-focused': {
                                        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}`,
                                    },
                                },
                            })}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel
                            htmlFor="password"
                            sx={{color: '#E5E7EB'}}
                        >Password</FormLabel>
                        <TextField
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            required
                            fullWidth
                            variant="outlined"
                            color={passwordError ? 'error' : 'primary'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock
                                            size={18}
                                            color='#E5E7EB'
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            sx={(theme) => ({
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 14,
                                    transition: 'box-shadow .18s ease, transform .18s ease',
                                    '& fieldset': {borderColor: alpha(theme.palette.primary.main, 0.25)},
                                    '&:hover fieldset': {borderColor: theme.palette.primary.main},
                                    '&.Mui-focused': {
                                        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}`,
                                    },
                                },
                            })}
                        />
                    </FormControl>

                    <PrimaryButton
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        endIcon={
                            isLoading ? null : (
                                <ArrowRight
                                    size={18}
                                    color="#E5E7EB"
                                />
                            )
                        }
                        sx={{color: '#E5E7EB'}}
                    >
                        {isLoading ? (
                            <CircularProgress
                                size={24}
                                color="inherit"
                            />
                        ) : (
                            'Sign in'
                        )}
                    </PrimaryButton>
                </Box>

                <Divider
                    sx={{
                        my: 1.5,
                        opacity: 0.6,
                        color: '#E5E7EB'
                    }}
                >or</Divider>

                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.25}}>
                    <OutlineButton
                        fullWidth
                        startIcon={<GoogleIcon />}
                        onClick={() => {
                                window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/users/login/google`;
                            }}
                    >
                        Sign in with Google
                    </OutlineButton>

                    <Typography
                        sx={{
                            textAlign: 'center',
                            mt: 1,
                            color: '#E5E7EB'
                        }}
                    >
                        Don&apos;t have an account?{' '}
                        <NavLink
                            to={Paths.REGISTER}
                            style={{color: '#6ea8fe', fontWeight: 700}}
                        >
                            Sign up
                        </NavLink>
                    </Typography>
                </Box>
            </Card>
        </SignInContainer>
    );
}
