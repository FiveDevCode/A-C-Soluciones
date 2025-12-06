import { useState } from "react";
import { FaPlus, FaUserCircle, FaBell, FaSyncAlt } from "react-icons/fa";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useMenu } from "../technical/MenuContext";
import NotificationBell from './NotificationBell';
import { useToastContext } from "../../contexts/ToastContext";

const Header = styled.header`
  background-color: #1976d2;
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  position: relative;
  padding-left: ${(props) => (props.$collapsed ? '100px' : '240px')};
  transition: padding-left 0.3s ease;

  @media (max-width: 1350px) {
    padding: 1.2rem 1.5rem;
    padding-left: ${(props) => (props.$collapsed ? '80px' : '200px')};
    font-size: 18px;
  }

  @media (max-width: 1280px) {
    padding-left: ${(props) => (props.$collapsed ? '80px' : '200px')};
  }

  @media (max-width: 768px) {
    padding: 1rem 1rem 1rem 70px;
    font-size: 16px;
  }
`;

const HeaderLeft = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  width: auto;

  @media (max-width: 768px) {
    position: static;
    transform: none;
    flex: 1;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  z-index: 1;
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  @media (max-width: 1350px) {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #f44336;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const TitleSection = styled.h2`
  color: #1565c0;
  font-size: 18px;
  margin-bottom: 15px;
  text-align: left;

  @media (max-width: 1350px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

const ContainerAdd = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background-color: white;
  margin: 40px auto 0 auto;
  align-self: center;
  padding: 20px;
  width: 85%;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.1);

  @media (max-width: 1350px) {
    width: 95%;
    padding: 15px;
    margin-top: 25px;
    border-radius: 6px 6px 0 0;
    margin: 40px 0 0 0;
  }
  
  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    gap: 10px;

    > button {
      display: none;
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  align-self: start;

  @media (max-width: 1350px) {
    gap: 10px;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  > button:first-child {
    display: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;

    > button:first-child {
      display: flex;
    }
  }
`;

const Button = styled.button`
  background-color: ${({ active }) => (active ? "#ffcdd2" : "#c0c0c0")};
  color: ${({ active }) => (active ? "#b71c1c" : "white")};
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s;
  font-weight: 600;

  &:hover {
    background-color: ${({ active }) => (active ? "#ef9a9a" : "#b0b0b0")};
  }

  @media (max-width: 1350px) and (min-width: 769px) {
    padding: 6px 10px;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 15px;
  }
`;

const AddButton = styled(Button)`
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;

  &:hover {
    background-color: #1565c0;
  }

  @media (max-width: 1350px) and (min-width: 769px) {
    padding: 6px 10px;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 15px;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #43a047;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;

  &:hover {
    background-color: #388e3c;
  }

  @media (max-width: 1350px) and (min-width: 769px) {
    padding: 6px 10px;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 15px;
  }
`;

const ButtonsGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const LoadingContent = styled.div`
  background: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RefreshButton = styled(Button)`
  background-color: #4caf50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  min-width: 40px;
  padding: 8px 14px;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
  }

  @media (max-width: 1350px) and (min-width: 769px) {
    padding: 6px 10px;
    font-size: 12px;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 15px;
  }
`;

const BaseHeaderSection = ({
  headerTitle = "GESTIÓN GENERAL",
  sectionTitle = "Listado de registros",
  addLabel = "Agregar",
  onAdd,
  secondaryLabel,
  secondaryIcon,
  onSecondaryAction,
  onDeleteSelected,
  onRefresh,
  selectedCount = 0,
  filterComponent,
  actionType = "Eliminar seleccionados",
  notificationCount = 0,
  isLoading = false,
  loadingMessage = "Procesando...",
}) => {
  const navigate = useNavigate();
  
  let collapsed = false;
  try {
    const menuContext = useMenu();
    collapsed = menuContext.collapsed;
  } catch (error) {
    // Si no hay contexto de menú, usar false por defecto
    collapsed = false;
  }

  const handleProfileClick = () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      const decoded = jwtDecode(token);
      const role = decoded.rol?.toLowerCase();
      
      switch(role) {
        case 'administrador':
          navigate('/admin/perfil');
          break;
        case 'tecnico':
          navigate('/tecnico/perfil');
          break;
        case 'contador':
          navigate('/contador/perfil');
          break;
        default:
          console.log('Rol no reconocido');
      }
    } catch (error) {
      console.error('Error al decodificar token:', error);
    }
  };

  const handleNotificationsClick = () => {
    // Por ahora solo un log, se puede expandir después
    console.log('Notificaciones clicked');
  };

  return (
    <>
      <Header $collapsed={collapsed}>
        <HeaderLeft>
          <span style={{ textAlign: 'center', width: '100%' }}>{headerTitle}</span>
        </HeaderLeft>
        <HeaderRight>
          <NotificationBell />
          <IconButton onClick={handleProfileClick} title="Ver Perfil">
            <FaUserCircle />
          </IconButton>
        </HeaderRight>
      </Header>

      <Card>
        <ContainerAdd>
          <TitleSection>
            {sectionTitle}
          </TitleSection>
          {(onAdd || onSecondaryAction) && (
            <ButtonsGroup>
              {onAdd && (
                <AddButton onClick={onAdd}>
                  <FaPlus /> {addLabel}
                </AddButton>
              )}
              {onSecondaryAction && (
                <SecondaryButton onClick={onSecondaryAction}>
                  {secondaryIcon} {secondaryLabel}
                </SecondaryButton>
              )}
            </ButtonsGroup>
          )}
        </ContainerAdd>

        <OptionsContainer>
          <SearchContainer>
            {filterComponent && <div>{filterComponent}</div>}
            {onRefresh && (
              <RefreshButton onClick={onRefresh} title="Refrescar lista">
                <FaSyncAlt />
              </RefreshButton>
            )}
          </SearchContainer>
          <ActionsRow>
            {onRefresh && (
              <RefreshButton onClick={onRefresh} title="Refrescar lista">
                <FaSyncAlt />
              </RefreshButton>
            )}
            {onDeleteSelected && (
              <Button
                active={selectedCount > 0}
                disabled={selectedCount === 0 || isLoading}
                onClick={onDeleteSelected}
              >
                {actionType}
              </Button>
            )}
          </ActionsRow>
        </OptionsContainer>
      </Card>

      {isLoading && (
        <LoadingOverlay>
          <LoadingContent>
            <Spinner />
            <LoadingText>{loadingMessage}</LoadingText>
          </LoadingContent>
        </LoadingOverlay>
      )}
    </>
  );
};

export default BaseHeaderSection;
