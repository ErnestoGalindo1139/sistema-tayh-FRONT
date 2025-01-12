import { Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import React from 'react';

export const SistemaTayhRoutes = (): React.JSX.Element => {
  return (
    <>
      {/* Aqui va el NavbarComponent */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      {/* Aqui va el FooterComponent */}
    </>
  );
};
