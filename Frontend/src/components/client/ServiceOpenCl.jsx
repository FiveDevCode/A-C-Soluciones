import { Button, IconButton } from "@mui/material";
import styled from "styled-components";
import ScreenRequestCl from "./ScreenRequestCl";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import getIconByService from "./GetIconServiceCl";

const ContainerService = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  width: 100vw;
  height: 100vh;
  padding: 2rem;
  overflow-y: auto;

  @media screen and (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContainerOpen = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
  color: white;

  @media screen and (max-width: 768px) {
    padding: 1rem 1.25rem;
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
  line-height: 1.3;

  @media screen and (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CloseButton = styled(IconButton)`
  && {
    color: white;
    padding: 0.5rem;
    margin-left: 1rem;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

const Content = styled.div`
  display: flex;
  gap: 0;
  min-height: 0;
  flex: 1;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.75rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-width: 240px;
  max-width: 280px;
  border-right: 2px solid #e5e7eb;

  @media screen and (max-width: 768px) {
    padding: 1.5rem;
    min-width: 100%;
    max-width: 100%;
    border-right: none;
    border-bottom: 2px solid #e5e7eb;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
  color: #fff;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin-bottom: 1rem;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);

  svg {
    width: 45px;
    height: 45px;
  }

  @media screen and (max-width: 768px) {
    width: 80px;
    height: 80px;

    svg {
      width: 40px;
      height: 40px;
    }
  }
`;

const ServiceName = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  text-align: center;
  line-height: 1.3;

  @media screen and (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.75rem;
  overflow-y: auto;
  max-height: calc(85vh - 180px);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;

    &:hover {
      background: #94a3b8;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 1.5rem;
    max-height: none;
  }
`;

const DescriptionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #007BFF;
`;

const Description = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
  color: #475569;
  line-height: 1.6;
  margin: 0;
  text-align: justify;
`;

const ContainerButton = styled.div`
  display: flex;
  gap: 0.875rem;
  padding: 1.25rem 1.75rem;
  background-color: #f8fafc;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;

  @media screen and (max-width: 768px) {
    padding: 1rem 1.25rem;
    flex-direction: column-reverse;

    & > * {
      width: 100%;
    }
  }
`;

const CancelButton = styled(Button)`
  && {
    background-color: #64748b;
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    text-transform: none;
    font-weight: 600;
    font-size: 0.85rem;
    min-width: auto;

    &:hover {
      background-color: #475569;
    }
  }
`;

const RequestButton = styled(Button)`
  && {
    background-color: #007BFF;
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    text-transform: none;
    font-weight: 600;
    font-size: 0.85rem;
    box-shadow: 0 3px 10px rgba(0, 123, 255, 0.3);
    min-width: auto;

    &:hover {
      background-color: #0056b3;
      box-shadow: 0 5px 14px rgba(0, 123, 255, 0.4);
    }
  }
`;

const ServiceOpenCl = ({ servicio, onClose }) => {
  const [showRequestScreen, setShowRequestScreen] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ContainerService onClick={handleBackdropClick}>
      <ContainerOpen onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{servicio.nombre}</Title>
          <CloseButton onClick={onClose} size="small">
            <CloseIcon />
          </CloseButton>
        </Header>

        <Content>
          <LeftColumn>
            <IconWrapper>
              {getIconByService(servicio.nombre)}
            </IconWrapper>
            <ServiceName>{servicio.nombre}</ServiceName>
          </LeftColumn>

          <RightColumn>
            <DescriptionTitle>Descripción del Servicio</DescriptionTitle>
            <Description>{servicio.descripcion}</Description>
          </RightColumn>
        </Content>

        <ContainerButton>
          <CancelButton variant="contained" onClick={onClose}>
            Cancelar
          </CancelButton>
          <RequestButton
            variant="contained"
            onClick={() => setShowRequestScreen(true)}
          >
            Solicitar Revisión
          </RequestButton>
        </ContainerButton>

        {showRequestScreen && (
          <ScreenRequestCl
            requestId={servicio.id}
            onClose={() => {
              setShowRequestScreen(false);
              onClose();
            }}
          />
        )}
      </ContainerOpen>
    </ContainerService>
  );
};

export default ServiceOpenCl;
