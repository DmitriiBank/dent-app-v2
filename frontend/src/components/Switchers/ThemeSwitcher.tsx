
import { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { ColorModeContext } from '../../styles/ThemeContext';


export const ThemeSwitcher = () => {
    const { mode, toggle } = useContext(ColorModeContext);
    const isDark = mode === 'dark';
    return (
        <Tooltip title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>
            <IconButton
                onClick={toggle}
                color="inherit"
                aria-label={isDark ? 'switch to light theme' : 'switch to dark theme'}
                sx={{
                    transition: 'transform .15s ease',
                    '&:hover': { transform: 'scale(1.05)'},
                    width: '40px'
                }}
            >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
        </Tooltip>
    );
};

