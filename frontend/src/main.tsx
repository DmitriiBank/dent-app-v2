
import { createRoot } from 'react-dom/client';
import * as React from 'react';
import './index.css';
import App from './App.tsx';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import { Navbar } from './components/Navbar/Navbar.tsx';
import { Header } from './components/Navbar/Header.tsx';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './styles/theme';
import { ColorModeContext } from './styles/ThemeContext';
// import { Sun, Moon } from 'lucide-react'; // для иконок переключателя

function Root() {
    const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
    const theme = React.useMemo(() => getTheme(mode), [mode]);

    const toggle = React.useCallback(() => {
        setMode((m) => (m === 'light' ? 'dark' : 'light'));
    }, []);

    return (
        <ColorModeContext.Provider value={{ mode, toggle }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <HashRouter>
                    <Header />
                    <div className="main">
                        <Navbar />
                        <div className={"main __right-block"}>
                            <App />
                        </div>
                    </div>
                </HashRouter>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <Root />
    </Provider>,
);
