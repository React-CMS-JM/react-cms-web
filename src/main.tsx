import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { App } from './App';
import '@mantine/core/styles.css';
import './index.css';

const mantineTheme = createTheme({
  fontFamily: "var(--font), 'Segoe UI', system-ui, sans-serif",
  primaryColor: 'indigo',
  defaultRadius: 10,
  cursorType: 'pointer',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={mantineTheme} defaultColorScheme="dark" forceColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
);
