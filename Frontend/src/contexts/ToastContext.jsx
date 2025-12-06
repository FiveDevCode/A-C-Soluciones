import { createContext, useContext } from 'react';
import { useToast } from '../components/common/ToastNotification';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const { showToast, ToastRenderer } = useToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastRenderer />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
