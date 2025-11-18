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
    submitFunc: (email: string) => Promise<void> | void;
    serverErrorKey?: string | null;
};


export default function RestorePasswordForm({submitFunc, serverErrorKey}: Props) {

    const [email, setEmail] = useState('');
    const [emailErr, setEmailErr] = useState<string>('');

    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const validate = () => {
        let ok = true;

        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setEmailErr('Please enter a valid email address.');
            ok = false;
        } else setEmailErr('');

        return ok;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await submitFunc(email.trim());

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
                    Restore password
                </Typography>


                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                >
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            fullWidth
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailErr}
                            helperText={emailErr}
                            color={emailErr ? 'error' : 'primary'}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting ? 'Sending code to your email' : 'Send to email'}
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
                    sx={{ mt: 1 }}
                >
                    {serverErrorText}
                </Typography>
            )}
        </SignInContainer>
    );
}
