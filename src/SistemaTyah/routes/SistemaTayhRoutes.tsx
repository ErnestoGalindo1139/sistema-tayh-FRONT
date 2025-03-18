// SistemaTayhRoutes.tsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import AdminLayout from '../components/AdminLayout';
import { HomePage } from '../pages/HomePage';
import { ClientesAdmin } from '../pages/ClientesAdmin';
import { EnviosAdmin } from '../pages/EnviosAdmin';
import { PedidosAdmin } from '../pages/PedidosAdmin';
import { ConfiguracionesAdmin } from '../pages/ConfiguracionesAdmin';
import { OrdenTrabajo } from '../pages/OrdenTrabajo';
import { PreciosAdmin } from '../pages/PreciosAdmin';
import { ModelosAdmin } from '../pages/ModelosAdmin';
import { FacturacionAdmin } from '../pages/FacturacionAdmin';
import { SeleccionarOrdenTrabajo } from '../pages/SeleccionarOrdenTrabajo';

export const SistemaTayhRoutes = (): React.JSX.Element => {
  return (
    <>
      {/* Aquí va el NavbarComponent si aplica */}
      <Routes>
        {/* Rutas de administración con layout común */}
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<HomePage />} />
          <Route path="clientes" element={<ClientesAdmin />} />
          <Route path="envios" element={<EnviosAdmin />} />
          <Route path="pedidos" element={<PedidosAdmin />} />
          <Route path="facturacion" element={<FacturacionAdmin />} />
          <Route path="configuraciones" element={<ConfiguracionesAdmin />} />
          <Route path="precios" element={<PreciosAdmin />} />
          <Route path="modelos" element={<ModelosAdmin />} />
          <Route
            path="/seleccionarOrdenTrabajo"
            // element={<OrdenTrabajo de_Genero="M" id_Modelo={1} id_Talla={1} />}
            element={<SeleccionarOrdenTrabajo />}
          />
          {/* <Route path="usuarios" element={<UsuariosAdmin />} /> */}
          {/* <Route path="reportes" element={<ReportesAdmin />} /> */}
        </Route>

        {/* Ruta independiente, fuera del layout de administración */}
        <Route path="/ordentrabajo/:id" element={<OrdenTrabajo />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      {/* Aquí va el FooterComponent si aplica */}
    </>
  );
};
