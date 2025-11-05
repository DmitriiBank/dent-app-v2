
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: {
            mode,
            primary: { main: '#1976d2' },
            secondary: { main: '#6ea8fe' },
            text: {
                primary: mode === 'dark' ? '#E5E7EB' : '#0f172a',
            },
            background: {
                default: mode === 'dark' ? '#0B1220' : '#f5f7fb',
                paper: mode === 'dark' ? '#151A21' : '#ffffff',
            },
        },
        shape: { borderRadius: 14 },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
            allVariants: { color: mode === 'dark' ? '#E5E7EB' : undefined },
        },
    });
