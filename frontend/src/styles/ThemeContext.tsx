import * as React from 'react';

export type ColorMode = 'light' | 'dark';

export const ColorModeContext = React.createContext<{
    mode: ColorMode;
    toggle: () => void;
}>({
    mode: 'dark',
    toggle: () => {},
});