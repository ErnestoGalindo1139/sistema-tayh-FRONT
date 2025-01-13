import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
  sidebarColor: '#19232c', // Color por defecto del sidebar
  sidebarTextColor: '#ffffff', // Color por defecto del texto del sidebar
  setSidebarColor: (color: string) => {},
  setSidebarTextColor: (color: string) => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarColor, setSidebarColor] = useState('#19232c'); // Color por defecto
  const [sidebarTextColor, setSidebarTextColor] = useState('#ffffff'); // Color por defecto

  const toggleDarkMode = (): void => {
    setIsDarkMode(!isDarkMode);
    const root = window.document.documentElement;
    root.classList.toggle('dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        sidebarColor,
        setSidebarColor,
        sidebarTextColor,
        setSidebarTextColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
