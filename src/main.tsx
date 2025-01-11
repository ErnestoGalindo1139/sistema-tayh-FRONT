import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import { SistemaTayhApp } from './SistemaTayhApp';
import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <SistemaTayhApp />
    </HashRouter>
  </StrictMode>
);
