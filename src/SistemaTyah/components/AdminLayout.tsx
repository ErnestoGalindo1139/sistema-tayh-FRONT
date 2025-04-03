// AdminLayout.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Image } from '@chakra-ui/react';

import { modulosData } from '../data/modulosData';
import { useTheme } from '../../ThemeContext';
import { Tooltip } from 'flowbite-react';

export default function AdminLayout(): React.JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { isDarkMode, sidebarColor, sidebarTextColor } = useTheme();

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (ruta: string): void => {
    navigate(ruta);
    setIsSidebarOpen(false);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = (): void => {
    // Aquí iría la lógica para cerrar sesión
    console.log('Cerrando sesión...');
    // Por ejemplo: navigate('/login');
  };

  // Detectar clics fuera del sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const darkenColor = (color: string, factor: number): string => {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.max(0, Math.min(255, Math.floor(r * factor)));
    g = Math.max(0, Math.min(255, Math.floor(g * factor)));
    b = Math.max(0, Math.min(255, Math.floor(b * factor)));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  return (
    <div className={`admin-container ${isDarkMode ? 'dark' : ''}`}>
      {/* Menú Hamburguesa para móviles */}
      <div className="hamburger">
        <span className="hamburger-icon" onClick={toggleSidebar}>
          &#9776;
        </span>
      </div>

      <aside
        ref={sidebarRef}
        className={`sidebar ${isSidebarOpen ? 'open' : ''} z-10`}
        style={{
          backgroundColor: sidebarColor,
          color: sidebarTextColor,
        }}
      >
        <div
          className="sidebar-header"
          style={{
            backgroundColor: darkenColor(sidebarColor, 0.6),
            color: sidebarTextColor,
          }}
        >
          <Image
            src={'img/Logo Tayh Clothing.png'}
            alt="Logo Tayh Clothing"
            objectFit="cover"
            borderRadius="md"
            width="150px"
            style={{ margin: '0 auto' }}
            mt={4}
          />
        </div>
        <nav className="sidebar-nav">
          <ul>
            {modulosData.map((modulo) => (
              <li
                key={modulo.id}
                style={{ color: sidebarTextColor }}
                className="font-semibold text-[1.8rem] flex items-center gap-3"
                onClick={() => handleMenuClick(modulo.ruta)}
              >
                <img
                  width="24"
                  height="24"
                  src={modulo.icono.url}
                  alt="dashboard-layout"
                />
                {modulo.texto}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content dark:bg-[#19232c]">
        {/* Nuevo Header */}
        <header className="header dark:bg-[#19232c] flex justify-between items-center border-b dark:border-gray-700]">
          <div className="md:flex-1"></div>{' '}
          {/* Espacio vacío para balancear el layout */}
          <h1 className="dark:text-white text-3xl tracking-[0.3rem] font-bold flex-1 md:text-center text-left">
            Sistema Tayh
          </h1>
          <div className="flex justify-end mr-2 flex-1">
            <Tooltip
              content="Cerrar sesión"
              className="text-[1.3rem]"
              placement="left"
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 dark:text-white hover:bg-gray-700 p-2 rounded"
              >
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/exit.png"
                  alt="logout"
                />
              </button>
            </Tooltip>
          </div>
        </header>

        {/* Aquí se renderizarán las rutas hijas */}
        <Outlet />
      </main>
    </div>
  );
}
