import React, { useState, useRef, useEffect } from 'react';
import { modulosData } from '../data/modulosData';

import { useTheme } from '../../ThemeContext';
import { HomePage } from './HomePage';
import { Image } from '@chakra-ui/react';
import { px } from 'framer-motion';
import { ClientesAdmin } from './ClientesAdmin';
import { EnviosAdmin } from './EnviosAdmin';
import { PedidosAdmin } from './PedidosAdmin';

export default function AdminPage(): React.JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(1);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { isDarkMode, sidebarColor, sidebarTextColor } = useTheme();

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (section: number): void => {
    setSelectedSection(section);
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

  // Renderizar la sección seleccionada
  const renderSection = (): React.JSX.Element => {
    switch (selectedSection) {
      case 1:
        return <HomePage />;
      case 2:
        return <ClientesAdmin />;
      case 3:
        return <EnviosAdmin />;
      case 4:
        return <PedidosAdmin />;
      // case 5:
      //   return <PedidosAdmin />;
      // case 6:
      //   return <ConfiguracionesAdmin />;
      // case 7:
      //   return <BlogAdmin />;
      default:
        return <HomePage />;
    }
  };

  const darkenColor = (color: string, factor: number): string => {
    // Convierte el color hexadecimal a RGB
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    // Aplica el factor para oscurecer el color
    r = Math.max(0, Math.min(255, Math.floor(r * factor)));
    g = Math.max(0, Math.min(255, Math.floor(g * factor)));
    b = Math.max(0, Math.min(255, Math.floor(b * factor)));

    // Convierte de nuevo a hexadecimal
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
          {/* <h2 style={{ color: sidebarTextColor }} className="font-bold text-xl"> */}
          {/* Tayh Clothing */}
          <Image
            src={'../../../public/Logo Tayh Clothing.png'}
            alt={`Logo Tayh Clothing`}
            objectFit="cover"
            borderRadius="md"
            width="150px"
            style={{ margin: '0 auto' }}
            mt={4}
          />
          {/* </h2>{' '} */}
          {/* Color del encabezado */}
        </div>
        <nav className="sidebar-nav">
          <ul>
            {modulosData.map((modulo) => (
              <li
                key={modulo.id}
                onClick={() => handleMenuClick(modulo.id)}
                style={{ color: sidebarTextColor }}
                className={`font-semibold text-xl`}
              >
                {modulo.texto}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main-content dark:bg-[#19232c]">
        <header className="header dark:bg-[#19232c]">
          <h1 className="dark:text-white text-[1.6rem]">
            Bienvenido al Panel de Administración
          </h1>
        </header>
        {renderSection()}
      </main>
    </div>
  );
}
