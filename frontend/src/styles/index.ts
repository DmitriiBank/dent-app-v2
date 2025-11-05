import { createTheme, alpha } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        elevated: { main: string };
    }
    interface PaletteOptions {
        elevated?: { main: string };
    }
}

const commonShape = { borderRadius: 14 };

const getComponents = (mode: 'light' | 'dark') =>
    ({
        MuiCssBaseline: {
            styleOverrides: {
                ':root': { colorScheme: mode },
                body: {
                    background:
                        mode === 'dark'
                            ? 'radial-gradient(1000px 800px at 20% 30%, rgba(25,118,210,0.25), transparent 70%), radial-gradient(1200px 900px at 80% 80%, rgba(99,102,241,0.25), transparent 70%), linear-gradient(180deg,#0b1120,#0f172a)'
                            : 'radial-gradient(1000px 800px at 20% 30%, rgba(25,118,210,0.12), transparent 70%), radial-gradient(1200px 900px at 80% 80%, rgba(99,102,241,0.12), transparent 70%), linear-gradient(180deg,#eef2ff,#ffffff)',
                    backgroundAttachment: 'fixed',
                },
                '*': { outlineColor: '#1976d2' },
            },
        },

        // Кнопки
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    textTransform: 'none',
                    fontWeight: 800,
                    letterSpacing: 0.2,
                    height: 48,
                    transition: 'all .18s ease',
                },
                containedPrimary: ({ theme }) => ({
                    height: 52,
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
                }),
                outlined: ({ theme }) => ({
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
                }),
            },
        },

        // Карточки (glass)
        MuiCard: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: 24,
                    backdropFilter: 'blur(10px)',
                    background:
                        theme.palette.mode === 'dark'
                            ? alpha('#0B1220', 0.6)
                            : alpha('#FFFFFF', 0.65),
                    border: `1px solid ${
                        theme.palette.mode === 'dark'
                            ? alpha('#8AB4F8', 0.18)
                            : alpha('#1976d2', 0.25)
                    }`,
                    boxShadow:
                        theme.palette.mode === 'dark'
                            ? '0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)'
                            : '0 20px 60px rgba(25,118,210,0.20), inset 0 1px 0 rgba(255,255,255,0.5)',
                }),
            },
        },

        // Поля ввода
        MuiTextField: {
            defaultProps: { variant: 'outlined' },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: 14,
                    '& fieldset': {
                        borderColor: alpha(theme.palette.primary.main, 0.25),
                    },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused': {
                        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                }),
                input: { fontWeight: 600 },
            },
        },

        // Метки и типографика
        MuiFormLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color:
                        theme.palette.mode === 'dark'
                            ? '#E5E7EB'
                            : theme.palette.text.primary,
                }),
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color:
                        theme.palette.mode === 'dark'
                            ? '#E5E7EB'
                            : theme.palette.text.primary,
                }),
            },
        },
    } satisfies ThemeOptions['components']);

export const createAppTheme = (mode: 'light' | 'dark' = 'dark') =>
    createTheme({
        palette: {
            mode,
            primary: { main: '#1976d2' },
            secondary: { main: '#6ea8fe' },
            success: { main: '#2e7d32' },
            error: { main: '#d32f2f' },
            text:
                mode === 'dark'
                    ? { primary: '#E5E7EB', secondary: '#9CA3AF' }
                    : { primary: '#0f172a', secondary: '#475569' },
            background:
                mode === 'dark'
                    ? { default: '#0B1220', paper: '#151A21' }
                    : { default: '#f5f7fb', paper: '#ffffff' },
            elevated: { main: mode === 'dark' ? '#1b212a' : '#f1f5f9' },
            divider: alpha('#1976d2', mode === 'dark' ? 0.2 : 0.15),
        },
        shape: commonShape,
        typography: {
            fontFamily:
                'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
            h1: { fontWeight: 900 },
            h2: { fontWeight: 900 },
            h3: { fontWeight: 800 },
            h4: { fontWeight: 800 },
            button: { fontWeight: 800, textTransform: 'none' },
            body1: { fontWeight: 600 },
            body2: { fontWeight: 600 },
            allVariants: {
                // ключевая строка: глобально текст = #E5E7EB в dark-режиме
                color: mode === 'dark' ? '#E5E7EB' : undefined,
            },
        },
        components: getComponents(mode),
    });
