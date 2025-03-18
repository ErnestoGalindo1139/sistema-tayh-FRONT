// AdminLayout.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Image } from '@chakra-ui/react';

import { modulosData } from '../data/modulosData';
import { useTheme } from '../../ThemeContext';

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
      <div className="hamburger" onClick={toggleSidebar}>
        <span className="hamburger-icon">&#9776;</span>
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
                className="font-semibold text-xl"
                onClick={() => handleMenuClick(modulo.ruta)}
              >
                {modulo.texto}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content dark:bg-[#19232c]">
        {/* <header className="header dark:bg-[#19232c]">
          <h1 className="dark:text-white text-[1.6rem]">
            Bienvenido al Panel de Administración
          </h1>
        </header> */}
        {/* Aquí se renderizarán las rutas hijas */}
        <Outlet />
      </main>
    </div>
  );
}
