import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
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
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ContainerToast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 7000;
  animation: ${slideIn} 0.3s ease-out;

  &.closing {
    animation: ${slideOut} 0.3s ease-out;
  }

  @media screen and (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
  }
`;

const ToastMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-left: 4px solid ${(props) => {
    switch (props.$type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
      default:
        return '#007BFF';
    }
  }};
  min-width: 320px;
  max-width: 400px;

  @media screen and (max-width: 768px) {
    min-width: auto;
    max-width: 100%;
    padding: 0.875rem 1rem;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => {
    switch (props.$type) {
      case 'success':
        return '#d1fae5';
      case 'error':
        return '#fee2e2';
      case 'warning':
        return '#fef3c7';
      case 'info':
      default:
        return '#e3f2fd';
    }
  }};
  flex-shrink: 0;

  svg {
    color: ${(props) => {
      switch (props.$type) {
        case 'success':
          return '#10b981';
        case 'error':
          return '#ef4444';
        case 'warning':
          return '#f59e0b';
        case 'info':
        default:
          return '#007BFF';
      }
    }};
    font-size: 24px;
  }
`;

const MessageContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MessageText = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
`;

const CloseButton = styled(IconButton)`
  && {
    padding: 0.25rem;
    color: #64748b;
    flex-shrink: 0;

    &:hover {
      background-color: #f1f5f9;
      color: #1e293b;
    }
  }
`;

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  const handleClose = () => {
    const container = document.querySelector('[data-toast-container]');
    if (container) {
      container.classList.add('closing');
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
      default:
        return <InfoIcon />;
    }
  };

  return (
    <ContainerToast data-toast-container>
      <ToastMessage $type={type}>
        <IconContainer $type={type}>
          {getIcon()}
        </IconContainer>
        <MessageContent>
          <MessageText>{message}</MessageText>
        </MessageContent>
        <CloseButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </CloseButton>
      </ToastMessage>
    </ContainerToast>
  );
};

export default Toast;

