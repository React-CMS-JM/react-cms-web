import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider, createTheme } from '@mantine/core';
import { App } from './App';
import { queryClient } from './lib/queryClient';
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
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={mantineTheme} defaultColorScheme="dark" forceColorScheme="dark">
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
