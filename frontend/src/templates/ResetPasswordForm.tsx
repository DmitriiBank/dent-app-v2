import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {Paths} from "../types/quiz-types.ts";
import {Card, SignInContainer} from "./SignIn.tsx";
import {NavLink, useNavigate} from "react-router-dom";

type Props = {
    submitFunc: (password: string, passwordConfirm: string) => Promise<void> | void;
    serverErrorKey?: string | null;
};


export default function ResetPasswordForm({
                                              submitFunc,
                                              serverErrorKey
                                          }: Props) {

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordErr, setPasswordErr] = useState<string>('');
    const [passwordConfirmErr, setPasswordConfirmErr] = useState<string>('');

    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const validate = () => {
        let ok = true;

        if (!password || password.length < 6) {
            setPasswordErr('Password must be at least 6 characters long.');
            ok = false;
        } else setPasswordErr('');

        if (passwordConfirm != password) {
            setPasswordConfirmErr('Passwords must be confirmed.');
            ok = false;
        } else setPasswordConfirmErr('');

        return ok;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await submitFunc(
                password,
                passwordConfirm
            )

            navigate(Paths.HOME ?? '/');
        } finally {
            setSubmitting(false);
        }
    };


    const getServerErrorText = (key?: string | null): string => {
        if (!key) return '';

        switch (key) {
            case 'user-not-found':
                return 'User with this email was not found.';
            case 'default':
            default:
                return 'Something went wrong. Please try again later.';
        }
    };

    const serverErrorText = getServerErrorText(serverErrorKey);

    return (
        <SignInContainer
            direction="column"
            justifyContent="space-between"
        >
            {serverErrorText && (
                <Typography
                    color="error"
                    role="alert"
                    sx={{mt: 1}}
                >
                    {serverErrorText}
                </Typography>
            )}
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}
                >
                    Enter new password
                </Typography>


                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                >
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            fullWidth
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!passwordErr}
                            helperText={passwordErr}

                            color={passwordErr ? 'error' : 'primary'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="passwordConfirm">Password Confirm</FormLabel>
                        <TextField
                            id="passwordConfirm"
                            name="passwordConfirm"
                            type="passwordConfirm"
                            autoComplete="new-passwordConfirm"
                            required
                            fullWidth
                            placeholder="••••••"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            error={!!passwordConfirmErr}
                            helperText={passwordConfirmErr}

                            color={passwordErr ? 'error' : 'primary'}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting ? 'Save new password...' : 'Create new password'}
                    </Button>
                </Box>

                <Divider><Typography sx={{color: 'text.secondary'}}>or</Typography></Divider>

                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <Typography sx={{textAlign: 'center'}}>
                        Already have an account?{' '}
                        <NavLink to={Paths.LOGIN}>Sign in</NavLink>
                    </Typography>
                </Box>
            </Card>
            {serverErrorText && (
                <Typography
                    color="error"
                    role="alert"
                    sx={{mt: 1}}
                >
                    {serverErrorText}
                </Typography>
            )}
        </SignInContainer>
    );
}
