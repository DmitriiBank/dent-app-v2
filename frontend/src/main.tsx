
import { createRoot } from 'react-dom/client';
import * as React from 'react';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './redux/store.ts';
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
                <BrowserRouter>
                    <Header />
                    <div className="main">
                        <div className="navbar--static">
                            <Navbar />
                        </div>
                        <div className={"main __right-block"}>
                            <App />
                        </div>
                    </div>
                </BrowserRouter>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate
            loading={true}
            persistor={persistor}
        >
            <Root />
        </PersistGate>
    </Provider>,
);
