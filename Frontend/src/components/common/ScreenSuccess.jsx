import React from "react";
import styled, { keyframes } from "styled-components";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

const ContainerScreen = styled.div`
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

const ContainerMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-left: 4px solid #10b981;
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
  background-color: #d1fae5;
  flex-shrink: 0;

  svg {
    color: #10b981;
    font-size: 24px;
  }
`;

const MessageContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MessageSuccess = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
`;

const MessageSubtext = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
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

const ScreenSuccess = ({ children, onClose }) => {
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

  // Auto-close after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ContainerScreen data-toast-container>
      <ContainerMessage>
        <IconContainer>
          <CheckCircleIcon />
        </IconContainer>
        <MessageContent>
          <MessageSuccess>{children}</MessageSuccess>
          <MessageSubtext>Tu solicitud ha sido procesada correctamente</MessageSubtext>
        </MessageContent>
        <CloseButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </CloseButton>
      </ContainerMessage>
    </ContainerScreen>
  );
};

export default ScreenSuccess;
