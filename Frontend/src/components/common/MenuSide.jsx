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
  faFaucet,
  faBolt,
  faBoxes,
  faBell,
  faFileAlt,
  faChartBar,
  faFileCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from './Logo';

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

  @media (max-width: 1350px) and (min-width: 769px) {
    width: ${(props) => (props.collapsed ? '60px' : '180px')};
    padding: 0.25rem 0;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${(props) => (props.mobileOpen ? '0' : '-280px')};
    width: 260px;
    height: 100vh;
    z-index: 1000;
    box-shadow: 2px 0 10px rgba(0,0,0,0.2);
    transition: left 0.3s ease;
    padding: 1rem 0;
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

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0;
    margin-bottom: 1rem;
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

  @media (max-width: 768px) {
    display: flex;
    padding: 1.5rem 0 1rem 0;
  }
`;

const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.25rem;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 768px) {
    padding: 0 0.75rem;
    gap: 0.35rem;
  }
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

  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin: 0.5rem 0 0.75rem 0;
    display: block;
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

  @media (max-width: 768px) {
    padding: 0.7rem 0.75rem;
    gap: 1rem;

    svg {
      font-size: 1.1rem;
    }

    span {
      display: inline;
      font-size: 0.9rem;
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

  @media (max-width: 768px) {
    padding: 0.7rem 0.75rem;
    gap: 1rem;

    svg {
      font-size: 1.1rem;
    }

    span {
      display: inline;
      font-size: 0.9rem;
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

  @media (max-width: 1350px) and (min-width: 769px) {
    margin-right: ${(props) => (props.collapsed ? '0' : '0.25rem')};
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 18px;
    left: 18px;
    width: 42px;
    height: 42px;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    cursor: pointer;
    z-index: 1001;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f5f5f5;
      box-shadow: 0 3px 12px rgba(0,0,0,0.15);
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

const MenuOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'show',
})`
  display: none;
  
  @media (max-width: 768px) {
    display: ${(props) => (props.show ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    transition: opacity 0.3s ease;
  }
`;

const MenuSide = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    window.dispatchEvent(new Event('authChange'));
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
      { to: '/admin/reportes-clientes-fijos', icon: faFileCirclePlus, label: 'Reportes Clientes Fijos' },
      { to: '/admin/administradores', icon: faUserTie, label: 'Administradores' },
      { to: '/admin/servicios', icon: faWrench, label: 'Servicios' },
      { to: '/admin/metricas', icon: faChartBar, label: 'Métricas y Estadísticas' },
      { to: '/admin/contadores', icon: faCalculator, label: 'Contabilidad' },
      { to: '/admin/facturas', icon: faMoneyBill, label: 'Facturas' },
      { to: '/admin/cuentas', icon: faCreditCard, label: 'Cuentas de pago' },
      { to: '/admin/inventario', icon: faBoxes, label: 'Inventario' },
      { to: '/admin/notificaciones', icon: faBell, label: 'Notificaciones' },
      { to: '/admin/reporte-electrico', icon: faBolt, label: 'Reportes eléctricos' },
      { to: '/admin/reporte-bombeo', icon: faFaucet, label: 'Reportes de bombeo' },
      { to: '/admin/ficha-mantenimiento', icon: faClipboardCheck, label: 'Fichas de mantenimiento' },
    ],

    tecnico: [
      { to: getHomeRouteByRole(role), icon: faHouse, label: 'Inicio' },
      { to: '/tecnico/servicios', icon: faWrench, label: 'Servicios' },
      { to: '/tecnico/visitas', icon: faCompass, label: 'Visitas' },
      { to: '/tecnico/reportes', icon: faFileAlt, label: 'Fichas de mantenimiento' },
      { to: '/tecnico/reporte-electrico', icon: faBolt, label: 'Reportes eléctricos' },
      { to: '/tecnico/reporte-bombeo', icon: faFaucet, label: 'Reportes de bombeo' },
    ],

    Contador: [
      { to: getHomeRouteByRole(role), icon: faHouse, label: 'Inicio' },
      { to: '/contador/metricas', icon: faChartBar, label: 'Métricas y Estadísticas' },
      { to: '/contador/facturas', icon: faMoneyBill, label: 'Facturas' },
      { to: '/contador/cuentas', icon: faCreditCard, label: 'Cuentas de pago' },
      { to: '/contador/inventario', icon: faBoxes, label: 'Inventario' }
    ]
  };
  
  const options = menuByRole[role] || [];

  return (
    <>
      <MobileMenuButton onClick={() => setMobileOpen(!mobileOpen)}>
        <PanelLeft size={22} color="black" strokeWidth={1} />
      </MobileMenuButton>

      <MenuOverlay show={mobileOpen} onClick={() => setMobileOpen(false)} />

      <SectionMenu collapsed={collapsed} mobileOpen={mobileOpen}>
        <ContainerMenu collapsed={collapsed}>
          <CollapseButton onClick={() => setCollapsed(!collapsed)}>
            <PanelLeft size={22} color="black" strokeWidth={1} />
          </CollapseButton>

          <LogoContainer to={getHomeRouteByRole(role)} collapsed={collapsed}>
            <Logo src={logo} size="130px" />
          </LogoContainer>
        </ContainerMenu>

        <MenuGroup>
          <MenuTitle collapsed={collapsed}>Principal</MenuTitle>
          {options.map((opt) => (
            <Tooltip key={opt.to} title={collapsed ? opt.label : ''} placement="right" arrow disableInteractive>
              <MenuOption 
                to={opt.to} 
                collapsed={collapsed}
                onClick={() => setMobileOpen(false)}
              >
                <FontAwesomeIcon icon={opt.icon} />
                <span>{opt.label}</span>
              </MenuOption>
            </Tooltip>
          ))}
        </MenuGroup>

        <div style={{ marginTop: 'auto', padding: '0 0.75rem' }}>
          <Divider sx={{ borderColor: 'rgba(0,0,0,0.1)', marginBottom: '0.75rem' }} />
          <Tooltip title={collapsed ? 'Salir' : ''} placement="right" arrow disableInteractive>
            <LogoutButton 
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }} 
              collapsed={collapsed}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              <span>Salir</span>
            </LogoutButton>
          </Tooltip>
        </div>
      </SectionMenu>
    </>
  );
};

export default MenuSide;
