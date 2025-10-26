import logo from '../../assets/common/logoA&C.png';
import { Divider, Tooltip, IconButton } from '@mui/material';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PanelLeft } from "lucide-react"

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
  faArrowRightFromBracket,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../common/Logo';

const SectionMenu = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 👈 separa el contenido superior e inferior */
  width: ${(props) => (props.collapsed ? '80px' : '250px')};
  background-color: #fff;
  color: #1e1f23;
  min-height: 100vh;
  padding: 1rem 0.5rem;
  box-shadow: inset -1px 0px 0px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  position: relative;
`;

const ContainerMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.collapsed ? 'center' : 'flex-start')};
  flex-direction: ${(props) => (props.collapsed ? 'column' : 'row')};
  width: 100%;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
`;

const LogoContainer = styled(Link)`
  display: ${(props) => (props.collapsed ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  padding-bottom: 1rem;
  transition: opacity 0.3s ease;
`;




const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0 0.4rem;
`;

const MenuTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: uppercase;
  margin: 0.5rem 0;
  letter-spacing: 0.5px;
  display: ${(props) => (props.collapsed ? 'none' : 'block')};
`;

const MenuOption = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.collapsed ? '0' : '0.8rem')};
  justify-content: ${(props) => (props.collapsed ? 'center' : 'flex-start')};
  padding: 0.6rem 0.9rem;
  text-decoration: none;
  color: #1e1f23;
  border-radius: 10px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: #f2f2f2;
    color: #000;
  }

  svg {
    font-size: 1.1rem;
  }

  span {
    display: ${(props) => (props.collapsed ? 'none' : 'inline')};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.collapsed ? '0' : '0.8rem')};
  justify-content: ${(props) => (props.collapsed ? 'center' : 'flex-start')};
  padding: 0.7rem 0.9rem;
  background: none;
  border: none;
  color: #1e1f23;
  border-radius: 10px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: #f2f2f2;
    color: #000;
  }

  svg {
    font-size: 1.1rem;
  }

  span {
    display: ${(props) => (props.collapsed ? 'none' : 'inline')};
  }
`;

const CollapseButton = styled(IconButton)`
  background-color: #fff !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 10;
  &:hover {
    background-color: #f2f2f2 !important;
  }
`;

const MenuSideAd = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

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

  const options = [
    { to: getHomeRouteByRole(role), icon: faHouse, label: 'Inicio' },
    { to: '/admin/solicitudes', icon: faClipboardList, label: 'Solicitudes' },
    { to: '/admin/visitas', icon: faCompass, label: 'Visitas' },
    { to: '/admin/tecnicos', icon: faTools, label: 'Técnicos' },
    { to: '/admin/clientes', icon: faUsers, label: 'Clientes' },
    { to: '/admin/administradores', icon: faUserTie, label: 'Administradores' },
    { to: '/admin/servicios', icon: faWrench, label: 'Servicios' },
    { to: '/admin/contadores', icon: faCalculator, label: 'Contabilidad' },
    { to: '/admin/facturas', icon: faMoneyBill, label: 'Facturas' },
    { to: '/admin/cuentas', icon: faCreditCard, label: 'Cuentas de pago' },
    { to: '/admin/inventario', icon: faTools, label: 'Inventario' },
  ];

  return (
    <SectionMenu collapsed={collapsed}>
      <ContainerMenu collapsed={collapsed}>
        <CollapseButton onClick={() => setCollapsed(!collapsed)}>
          <PanelLeft size={22} color="black" strokeWidth={1} />
        </CollapseButton>

        <LogoContainer
          to={getHomeRouteByRole(role)}
          collapsed={collapsed} // <-- pasa prop para esconder
        >
          <Logo src={logo} size={collapsed ? '45px' : '120px'} />
        </LogoContainer>
      </ContainerMenu>
      
      {/* Parte superior */}
{/* Parte superior */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Divider sx={{ borderColor: 'rgba(0,0,0,0.1)' }} />

        <MenuGroup>
          <MenuTitle collapsed={collapsed}>Principal</MenuTitle>
          {options.map((opt) => (
            <Tooltip
              key={opt.to}
              title={collapsed ? opt.label : ''}
              placement="right"
              arrow
            >
              <MenuOption to={opt.to} collapsed={collapsed}>
                <FontAwesomeIcon icon={opt.icon} />
                <span>{opt.label}</span>
              </MenuOption>
            </Tooltip>
          ))}
        </MenuGroup>
      </div>


      {/* Parte inferior */}
      <div>
        <Divider sx={{ borderColor: 'rgba(0,0,0,0.1)', marginBottom: '0.8rem' }} />
        <Tooltip title={collapsed ? 'Salir' : ''} placement="right" arrow>
          <LogoutButton onClick={handleLogout} collapsed={collapsed}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <span>Salir</span>
          </LogoutButton>
        </Tooltip>
      </div>
    </SectionMenu>
  );
};

export default MenuSideAd;
