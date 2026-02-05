import React, { useState, JSX } from 'react';
import { Card } from 'flowbite-react';
import { FaDollarSign, FaTshirt, FaUsers, FaChartBar } from 'react-icons/fa';
import { PreciosAdmin } from './PreciosAdmin';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
// import { ModelosAdmin } from './ModelosAdmin';
// import { UsuariosAdmin } from './UsuariosAdmin';
// import { ReportesAdmin } from './ReportesAdmin';

const items = [
  {
    title: 'Precios',
    path: '/precios',
    icon: <FaDollarSign size={30} className="m-auto" />,
    color: 'bg-blue-500',
  },
  {
    title: 'Modelos',
    path: '/modelos',
    icon: <FaTshirt size={30} className="m-auto" />,
    color: 'bg-pink-500',
  },
  {
    title: 'Inventario',
    path: '/inventario',
    icon: <FaUsers size={30} className="m-auto" />,
    color: 'bg-blue-500',
  },
  // {
  //   title: 'Reportes',
  //   path: '/reportes',
  //   icon: <FaChartBar size={30} className="m-auto" />,
  //   color: 'bg-pink-500',
  // },
];

export const ConfiguracionesAdmin = (): React.JSX.Element => {
  const navigate = useNavigate();

  const { getUser } = useAuth();
  const usuario = getUser();
  const roleId = usuario?.id_Rol ?? null;

  const itemsFiltrados = items.filter((item) => {
    if (roleId != 5) return items; // Admin tiene acceso a todo
    if (roleId === 5) {
      // Rol de Inventario
      return item.title === 'Inventario';
    }
  });

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsFiltrados.map((item) => (
          <Card
            key={item.title}
            className={`cursor-pointer hover:shadow-lg text-white flex flex-col items-center justify-center p-5 rounded-lg ${item.color}`}
            onClick={() => item.path && navigate(item.path)}
          >
            {item.icon}
            <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
};
