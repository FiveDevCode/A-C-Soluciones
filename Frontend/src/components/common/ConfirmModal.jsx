import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 25px 35px;
  width: 400px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
`;

const Message = styled.p`
  font-size: 16px;
  margin-bottom: 25px;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const Button = styled.button`
  padding: 8px 18px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  color: white;
  transition: 0.2s ease-in-out;

  ${({ variant }) =>
    variant === "confirm"
      ? `
        background-color: #28a745;
        &:hover { background-color: #218838; }
      `
      : `
        background-color: #dc3545;
        &:hover { background-color: #c82333; }
      `}
`;

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <Overlay>
      <ModalContainer>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button variant="confirm" onClick={onConfirm}>
            Aceptar
          </Button>
          <Button variant="cancel" onClick={onCancel}>
            Cancelar
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmModal;
