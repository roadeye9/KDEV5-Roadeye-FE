import './styles/global.scss';
import './styles/global.css';

import React from 'react';
import App from './app';
import { NextUIProvider } from '@nextui-org/react';
import { createRoot } from 'react-dom/client';

// Ensure React is available in the global scope
window.React = React;

const container = document.querySelector('#root');
const root = createRoot(container as HTMLElement);


root.render(
    <React.StrictMode>
        <NextUIProvider>
            <App />
        </NextUIProvider>
    </React.StrictMode>
);
