import { StrictMode } from 'react';

import { NextUIProvider } from '@nextui-org/react';
import { createRoot } from 'react-dom/client';

import App from './app';

import './main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </StrictMode>
);
