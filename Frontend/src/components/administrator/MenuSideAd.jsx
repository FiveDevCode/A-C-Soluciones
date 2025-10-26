import logo from '../../assets/common/logoA&C.png';
import { Divider } from '@mui/material';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faClipboardList,
  faCompass,
  faTools,
  faUsers,
  faUserTie,
  faWrench,
  faCalculator,
  faMoneyBill,
  faCreditCard,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';

const SectionMenu = styled.section`
  display: flex;
  flex-direction: column;
  width: 250px;
  background-color: #1e1f23;
  color: #e5e5e5;
  min-height: 100vh;
  padding: 1rem 0.5rem;
  justify-content: space-between;
  box-shadow: inset -1px 0px 0px rgba(255, 255, 255, 0.1);
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1rem;
`;

const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0 0.4rem;
`;

const MenuTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 500;
  color: #a0a0a0;
  text-transform: uppercase;
  margin: 0.5rem 0;
  letter-spacing: 0.5px;
`;

const MenuOption = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0.9rem;
  text-decoration: none;
  color: #e5e5e5;
  border-radius: 10px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: #2a2b31;
    color: #fff;
  }

  svg {
    font-size: 1.1rem;
    opacity: 0.8;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 0.9rem;
  background: none;
  border: none;
  color: #e5e5e5;
  border-radius: 10px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: #2a2b31;
    color: #fff;
  }

  svg {
    font-size: 1.1rem;
    opacity: 0.8;
  }
`;

const MenuSideAd = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const role = localStorage.getItem('userRole');

  const getHomeRouteByRole = (role) => {
    switch (role) {
      case 'tecnico':
        return '/tecnico/inicio';
      case 'administrador':
        return '/admin/inicio';
      default:
        return '/';
    }
  };

  return (
    <SectionMenu>
      {/* Logo */}
      <div>
        <LogoContainer to={getHomeRouteByRole(role)}>
          <Logo src={logo} size="120px" />
        </LogoContainer>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Grupo de opciones */}
        <MenuGroup>
          <MenuTitle>Principal</MenuTitle>
          <MenuOption to={getHomeRouteByRole(role)}>
            <FontAwesomeIcon icon={faHouse} />
            Inicio
          </MenuOption>
          <MenuOption to="admin/solicitudes">
            <FontAwesomeIcon icon={faClipboardList} />
            Solicitudes
          </MenuOption>
          <MenuOption to="admin/visitas">
            <FontAwesomeIcon icon={faCompass} />
            Visitas
          </MenuOption>
          <MenuOption to="/admin/tecnicos">
            <FontAwesomeIcon icon={faTools} />
            Técnicos
          </MenuOption>
          <MenuOption to="/admin/clientes">
            <FontAwesomeIcon icon={faUsers} />
            Clientes
          </MenuOption>
          <MenuOption to="/admin/administradores">
            <FontAwesomeIcon icon={faUserTie} />
            Administradores
          </MenuOption>
          <MenuOption to="/admin/servicios">
            <FontAwesomeIcon icon={faWrench} />
            Servicios
          </MenuOption>
          <MenuOption to="/admin/contadores">
            <FontAwesomeIcon icon={faCalculator} />
            Contabilidad
          </MenuOption>
          <MenuOption to="/admin/facturas">
            <FontAwesomeIcon icon={faMoneyBill} />
            Facturas
          </MenuOption>
          <MenuOption to="/admin/cuentas">
            <FontAwesomeIcon icon={faCreditCard} />
            Cuentas de pago
          </MenuOption>
          <MenuOption to="/admin/inventario">
            <FontAwesomeIcon icon={faTools} />
            Inventario
          </MenuOption>
        </MenuGroup>
      </div>

      {/* Sección inferior */}
      <div>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', marginBottom: '0.8rem' }} />
        <LogoutButton onClick={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          Salir
        </LogoutButton>
      </div>
    </SectionMenu>
  );
};

export default MenuSideAd;
