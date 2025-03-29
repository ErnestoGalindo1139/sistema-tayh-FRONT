import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import { SistemaTayhApp } from './SistemaTayhApp';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './auth/AuthProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <HashRouter>
        <ChakraProvider>
          <ThemeProvider>
            <SistemaTayhApp />
          </ThemeProvider>
        </ChakraProvider>
      </HashRouter>
    </AuthProvider>
  </StrictMode>
);
