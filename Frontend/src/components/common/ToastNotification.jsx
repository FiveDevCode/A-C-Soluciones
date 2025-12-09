import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

const slideIn = keyframes`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
`;

const Toast = styled.div`
  background: ${props => props.$type === 'success' ? '#4caf50' : '#f44336'};
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 400px;
  animation: ${props => props.$isClosing ? slideOut : slideIn} 0.3s ease-out;
  pointer-events: all;

  @media (max-width: 768px) {
    min-width: 250px;
    max-width: calc(100vw - 40px);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
`;

const Message = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ToastNotification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  return (
    <Toast $type={type} $isClosing={isClosing}>
      <IconWrapper>
        {type === 'success' ? <CheckCircleIcon /> : <ErrorIcon />}
      </IconWrapper>
      <Message>{message}</Message>
      <CloseButton onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </CloseButton>
    </Toast>
  );
};

// Hook para manejar múltiples toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastRenderer = () => (
    <ToastContainer>
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContainer>
  );

  return { showToast, ToastRenderer };
};

export default ToastNotification;
