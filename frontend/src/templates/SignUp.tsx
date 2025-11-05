import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {Paths, type SignupData} from "../types/quiz-types.ts";
import {Card, SignInContainer} from "./SignIn.tsx";
import {NavLink, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import type {RootState} from "../redux/store.ts";
import {ERROR_DICT} from "../types/error-types.ts";

type Props = {
    submitFunc: (data: SignupData) => Promise<void> | void;
    serverErrorKey?: string | null;
};

function tErr(key: string | null | undefined, lang: 'ru' | 'he') {
    const k = (key && (key in ERROR_DICT) ? key : 'default') as keyof typeof ERROR_DICT;
    return ERROR_DICT[k][lang];
}

export default function SignUpForm({submitFunc, serverErrorKey}: Props) {
    const lang = useSelector((state: RootState) => state.lang.language);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [firstNameErr, setFirstNameErr] = useState<string>('');
    const [lastNameErr, setLastNameErr] = useState<string>('');
    const [emailErr, setEmailErr] = useState<string>('');
    const [passwordErr, setPasswordErr] = useState<string>('');
const [passwordConfirmErr, setPasswordConfirmErr] = useState<string>('');

    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const validate = () => {
        let ok = true;

        // First name
        if (!firstName.trim()) {
            setFirstNameErr('First name is required.');
            ok = false;
        } else setFirstNameErr('');

        // Last name
        if (!lastName.trim()) {
            setLastNameErr('Last name is required.');
            ok = false;
        } else setLastNameErr('');

        // Email
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setEmailErr('Please enter a valid email address.');
            ok = false;
        } else setEmailErr('');

        // Password
        if (!password || password.length < 6) {
            setPasswordErr('Password must be at least 6 characters long.');
            ok = false;
        } else setPasswordErr('');

        if (passwordConfirm != password ) {
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
            await submitFunc({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email: email.trim(),
                password,
                passwordConfirm
            });

            navigate(Paths.HOME ?? '/');
        } finally {
            setSubmitting(false);
        }
    };

    const serverErrorText = serverErrorKey ? tErr(serverErrorKey, lang) : '';


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
                    Sign up
                </Typography>


                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                >
                    <FormControl>
                        <FormLabel htmlFor="first_name">First name</FormLabel>
                        <TextField
                            id="first_name"
                            name="first_name"
                            autoComplete="given-name"
                            required
                            fullWidth
                            placeholder="Jon"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={!!firstNameErr}
                            helperText={firstNameErr}
                            color={firstNameErr ? 'error' : 'primary'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="last_name">Last name</FormLabel>
                        <TextField
                            id="last_name"
                            name="last_name"
                            autoComplete="family-name"
                            required
                            fullWidth
                            placeholder="Snow"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            error={!!lastNameErr}
                            helperText={lastNameErr}
                            color={lastNameErr ? 'error' : 'primary'}
                        />
                    </FormControl>

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

                    <FormControlLabel
                        control={<Checkbox
                            value="allowExtraEmails"
                            color="primary"
                        />}
                        label="I want to receive updates via email."
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting ? 'Signing up…' : 'Sign up'}
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

        </SignInContainer>
    );
}
