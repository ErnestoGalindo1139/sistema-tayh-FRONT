import { Route, Routes } from 'react-router-dom';
import { SistemaTayhRoutes } from '../SistemaTyah/routes/SistemaTayhRoutes';

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<SistemaTayhRoutes />} />
      </Routes>
    </>
  );
};
