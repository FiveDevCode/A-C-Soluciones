import logo from '../../assets/common/logoA&C.png';
import { Divider, Tooltip, IconButton } from '@mui/material';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PanelLeft } from "lucide-react";
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
  faClipboardCheck,
  faWater,
  faFireExtinguisher,
  faFaucet,
  faBolt,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../common/Logo';

const SectionMenu = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${(props) => (props.collapsed ? '80px' : '220px')};
  background-color: #fff;
  color: #1e1f23;
  min-height: 100vh;
  padding: 0.5rem 0;
  box-shadow: inset -1px 0px 0px rgba(0,0,0,0.1);
  transition: width 0.3s ease;
  position: relative;

  @media (max-width: 1350px) {
    width: ${(props) => (props.collapsed ? '60px' : '180px')};
    padding: 0.25rem 0;
  }
`;

const ContainerMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.collapsed ? 'center' : 'flex-start')};
  flex-direction: ${(props) => (props.collapsed ? 'column' : 'row')};
  width: 100%;
  transition: all 0.3s ease;
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;

  @media (max-width: 1350px) {
    padding: 0 0.25rem;
    margin-bottom: 0.25rem;
  }
`;

const LogoContainer = styled(Link)`
  display: ${(props) => (props.collapsed ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  padding: 1rem 0;

  @media (max-width: 1350px) {
    padding: 0.5rem 0;
  }
`;

const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.25rem;
  overflow-y: auto;
  flex: 1;
`;

const MenuTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: uppercase;
  margin: 0.5rem 0;
  display: ${(props) => (props.collapsed ? 'none' : 'block')};

  @media (max-width: 1350px) {
    font-size: 0.65rem;
    margin: 0.25rem 0;
  }
`;

const MenuOption = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.collapsed ? '0' : '0.8rem')};
  justify-content: ${(props) => (props.collapsed ? 'center' : 'flex-start')};
  padding: 0.5rem 0.75rem;
  text-decoration: none;
  color: #1e1f23;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: #f2f2f2;
    color: #000;
  }

  svg {
    font-size: 1rem;

    @media (max-width: 1350px) {
      font-size: 0.85rem;
    }
  }

  span {
    display: ${(props) => (props.collapsed ? 'none' : 'inline')};
    @media (max-width: 1350px) {
      font-size: 0.75rem;
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.collapsed ? '0' : '0.8rem')};
  justify-content: ${(props) => (props.collapsed ? 'center' : 'flex-start')};
  padding: 0.6rem 0.75rem;
  background: none;
  border: none;
  color: #1e1f23;
  border-radius: 8px;
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: #f2f2f2;
    color: #000;
  }

  svg {
    font-size: 1rem;

    @media (max-width: 1350px) {
      font-size: 0.85rem;
    }
  }

  span {
    display: ${(props) => (props.collapsed ? 'none' : 'inline')};

    @media (max-width: 1350px) {
      font-size: 0.75rem;
    }
  }
`;

const CollapseButton = styled(IconButton)`
  background-color: #fff !important;
  border: 1px solid rgba(0,0,0,0.1);
  margin-right: ${(props) => (props.collapsed ? '0' : '0.5rem')};

  &:hover {
    background-color: #f2f2f2 !important;
  }

  @media (max-width: 1350px) {
    margin-right: ${(props) => (props.collapsed ? '0' : '0.25rem')};
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
      case 'tecnico': return '/tecnico/inicio';
      case 'Contador': return '/contador/inicio';
      case 'administrador': return '/admin/inicio';
      default: return '/';
    }
  };

  const menuByRole = {
    administrador: [
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
      { to: '/admin/reporte-mantenimiento', icon: faBolt, label: 'Reporte mantenimiento' },
      { to: '/admin/reporte-bombeo', icon: faFaucet, label: 'Reporte bombeo' },
      { to: '/admin/reporte', icon: faClipboardCheck, label: 'Reporte' },
    ],

    Contador: [
      { to: getHomeRouteByRole(role), icon: faHouse, label: 'Inicio' },
      { to: '/contador/facturas', icon: faMoneyBill, label: 'Facturas' },
      { to: '/contador/cuentas', icon: faCreditCard, label: 'Cuentas de pago' },
      { to: '/contador/reportes', icon: faClipboardList, label: 'Reportes' },
    ]
  };
  
  const options = menuByRole[role] || [];

  return (
    <SectionMenu collapsed={collapsed}>
      <ContainerMenu collapsed={collapsed}>
        <CollapseButton onClick={() => setCollapsed(!collapsed)}>
          <PanelLeft size={22} color="black" strokeWidth={1} />
        </CollapseButton>

        <LogoContainer to={getHomeRouteByRole(role)} collapsed={collapsed}>
          <Logo src={logo} size={collapsed ? '45px' : '120px'} />
        </LogoContainer>
      </ContainerMenu>

      <MenuGroup>
        <MenuTitle collapsed={collapsed}>Principal</MenuTitle>
        {options.map((opt) => (
          <Tooltip key={opt.to} title={collapsed ? opt.label : ''} placement="right" arrow>
            <MenuOption to={opt.to} collapsed={collapsed}>
              <FontAwesomeIcon icon={opt.icon} />
              <span>{opt.label}</span>
            </MenuOption>
          </Tooltip>
        ))}
      </MenuGroup>

      <div style={{ marginTop: 'auto', padding: '0 0.5rem' }}>
        <Divider sx={{ borderColor: 'rgba(0,0,0,0.1)', marginBottom: '0.5rem' }} />
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
