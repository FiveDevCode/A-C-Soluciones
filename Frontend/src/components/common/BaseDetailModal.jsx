import styled from "styled-components";
import { Button } from "@mui/material";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 16px;
  width: 400px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.25);

  @media (max-width: 1280px) {
    width: 330px;
    padding: 20px;
    border-radius: 12px;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
  color: #000;
  font-size: 20px;

  @media (max-width: 1280px) {
    font-size: 16px;
    margin-bottom: 15px;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.8rem;
`;

const Label = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: #000;

  @media (max-width: 1280px) {
    font-size: 0.8rem;
  }
`;

const Value = styled.span`
  font-size: 0.9rem;
  color: #333;

  @media (max-width: 1280px) {
    font-size: 0.8rem;
  }
`;

const EstadoBadge = styled.span`
  background: ${(props) =>
    props.estado === "Nueva"
      ? "#4CAF50"
      : props.estado === "En mantenimiento"
      ? "#FFC107"
      : props.estado === "Inactiva"
      ? "#9E9E9E"
      : "#2196F3"};
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;

  @media (max-width: 1280px) {
    font-size: 0.7rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;

  @media (max-width: 1280px) {
    margin-top: 1rem;
  }
`;

const StyledButton = styled(Button)`
  && {
    font-size: 0.875rem;
    padding: 0.375rem 1rem;
    border-radius: 0.375rem;
    text-transform: none;
    font-weight: 600;
    min-width: 6rem;
    height: 2.25rem;
  }

  @media (max-width: 1280px) {
    && {
      font-size: 0.6875rem;
      padding: 0.25rem 1rem;
      min-width: 5rem;
      height: 1.75rem;
    }
  }
`;

const BaseDetailModal = ({ title, fields, onClose }) => {
  return (
    <ModalOverlay>
      <ModalContent>
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

        <ButtonsContainer>
          <StyledButton
            variant="contained"
            color="error"
            onClick={onClose}
          >
            Regresar
          </StyledButton>
        </ButtonsContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BaseDetailModal;
