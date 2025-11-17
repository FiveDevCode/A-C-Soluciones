import { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu debe usarse dentro de MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <MenuContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </MenuContext.Provider>
  );
};