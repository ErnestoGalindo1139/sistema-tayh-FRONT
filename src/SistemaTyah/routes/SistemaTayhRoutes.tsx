import { Route, Routes } from 'react-router-dom';
// import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import React from 'react';
import AdminPage from '../pages/AdminPage';

export const SistemaTayhRoutes = (): React.JSX.Element => {
  return (
    <>
      {/* Aqui va el NavbarComponent */}

      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      {/* Aqui va el FooterComponent */}
    </>
  );
};
