import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 1.8rem 2rem;
  width: 450px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h3`
  text-align: center;
  font-weight: 600;
  color: #000;
  margin-bottom: 1.5rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.8rem;
`;

const Label = styled.span`
  font-weight: 600;
  font-size: 0.95rem;
  color: #000;
`;

const Value = styled.span`
  font-size: 0.9rem;
  color: #333;
`;

const EstadoBadge = styled.span`
  background: ${(props) =>
    props.estado === "Nueva"
      ? "#4CAF50"
      : props.estado === "Usada"
      ? "#FFC107"
      : "#9E9E9E"};
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.2rem;
`;

const Button = styled.button`
  background-color: #424242;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background-color: #333;
  }
`;

const BaseDetailModal = ({ title, fields, onClose }) => {
  return (
    <Overlay>
      <ModalContainer>
        <Title>{title}</Title>

        {fields.map((item, i) => (
          <FieldGroup key={i}>
            <Label>{item.label}:</Label>
            {item.isBadge ? (
              <EstadoBadge estado={item.value}>{item.value}</EstadoBadge>
            ) : (
              <Value>{item.value ?? "—"}</Value>
            )}
          </FieldGroup>
        ))}

        <Footer>
          <Button onClick={onClose}>Regresar</Button>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default BaseDetailModal;
