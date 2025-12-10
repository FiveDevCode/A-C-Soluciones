import Logo from '../common/Logo';
import logo from '../../assets/common/logoA&C.png';
import { Divider, Tooltip, IconButton } from '@mui/material';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowRightFromBracket, faWrench, faHistory, faCircleUser, faBolt, faFaucet} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PanelLeft } from 'lucide-react';
import { useMenu } from './MenuContext';

const SectionMenu = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${(props) => (props.$collapsed ? '80px' : '220px')};
  background-color: #ffffff;
  color: #1e1f23;
  height: 100vh;
  padding: 0.5rem 0;
  box-shadow: inset -1px 0px 0px rgba(0,0,0,0.1);
  transition: width 0.3s ease;
  z-index: 999;
  overflow-y: auto;

  @media (max-width: 1280px) {
    width: ${(props) => (props.$collapsed ? '60px' : '180px')};
    padding: 0.25rem 0;
  }
`;

const ContainerMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'space-between')};
  flex-direction: row;
  width: 100%;
  transition: all 0.3s ease;
  padding: 0.5rem;
  margin-bottom: 0.5rem;

  @media (max-width: 1280px) {
    padding: 0.25rem;
    margin-bottom: 0.25rem;
  }
`;

const LogoContainer = styled(Link)`
  display: ${(props) => (props.$collapsed ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
  flex: 1;

  @media (max-width: 1280px) {
    padding: 0.25rem 0;
  }
`;

const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.5rem;
  overflow-y: auto;
  flex: 1;
`;

const MenuTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: uppercase;
  text-align: center;
  margin: 0.5rem 0;
  display: ${(props) => (props.$collapsed ? 'none' : 'block')};
  padding-left: 0.25rem;

  @media (max-width: 1280px) {
    font-size: 0.65rem;
    margin: 0.25rem 0;
  }
`;

const MenuOption = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$collapsed ? '0' : '0.8rem')};
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'flex-start')};
  padding: 0.75rem;
  text-decoration: none;
  color: ${(props) => (props.$active ? '#007BFF' : '#1e1f23')};
  background-color: ${(props) => (props.$active ? '#e3f2fd' : 'transparent')};
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
  font-size: 0.9rem;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  border-left: ${(props) => (props.$active ? '3px solid #007BFF' : '3px solid transparent')};
  padding-left: ${(props) => (props.$active ? 'calc(0.75rem - 3px)' : '0.75rem')};

  &:hover {
    background-color: ${(props) => (props.$active ? '#e3f2fd' : '#f2f2f2')};
    color: ${(props) => (props.$active ? '#007BFF' : '#000')};
  }

  svg {
    font-size: 1.1rem;
    min-width: 20px;
    color: ${(props) => (props.$active ? '#007BFF' : 'inherit')};

    @media (max-width: 1280px) {
      font-size: 0.95rem;
    }
  }

  span {
    display: ${(props) => (props.$collapsed ? 'none' : 'inline')};
    white-space: nowrap;
    
    @media (max-width: 1280px) {
      font-size: 0.8rem;
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$collapsed ? '0' : '0.8rem')};
  justify-content: ${(props) => (props.$collapsed ? 'center' : 'flex-start')};
  padding: 0.75rem;
  background: none;
  border: none;
  color: #1e1f23;
  border-radius: 8px;
  text-align: left;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background-color: #f2f2f2;
    color: #000;
  }

  svg {
    font-size: 1.1rem;
    min-width: 20px;

    @media (max-width: 1280px) {
      font-size: 0.95rem;
    }
  }

  span {
    display: ${(props) => (props.$collapsed ? 'none' : 'inline')};
    white-space: nowrap;

    @media (max-width: 1280px) {
      font-size: 0.8rem;
    }
  }
`;

const CollapseButton = styled(IconButton)`
  background-color: #fff !important;
  border: 1px solid rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #f2f2f2 !important;
  }
`;

const MenuSideCl = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, setCollapsed } = useMenu();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const options = [
    { to: '/cliente/perfil', icon: faCircleUser, label: 'Perfil' },
    { to: '/cliente/inicio', icon: faHouse, label: 'Inicio' },
    { to: '/cliente/servicios', icon: faWrench, label: 'Servicios' },
    { to: '/cliente/historial', icon: faHistory, label: 'Historial de visitas' },
    { to: '/cliente/reporte-electrico', icon: faBolt, label: 'Reportes eléctricos' },
    { to: '/cliente/reporte-bombeo', icon: faFaucet, label: 'Reportes de bombeo' },
  ];

  return (
    <SectionMenu $collapsed={collapsed}>
      <div>
        <ContainerMenu $collapsed={collapsed}>
          <CollapseButton onClick={() => setCollapsed(!collapsed)} size="small">
            <PanelLeft size={22} color="black" strokeWidth={1} />
          </CollapseButton>

          <LogoContainer to="/cliente/inicio" $collapsed={collapsed}>
            <Logo src={logo} size={collapsed ? '45px' : '100px'} />
          </LogoContainer>
        </ContainerMenu>
        
        <MenuGroup>
          <MenuTitle $collapsed={collapsed}>Principal</MenuTitle>
          {options.map((opt) => {
            const isActive = location.pathname === opt.to || 
              (opt.to === '/cliente/inicio' && location.pathname === '/cliente/inicio') ||
              (opt.to === '/cliente/perfil' && (location.pathname === '/cliente/perfil' || location.pathname === '/cliente/editar-perfil')) ||
              (opt.to === '/cliente/servicios' && location.pathname.startsWith('/cliente/servicios')) ||
              (opt.to === '/cliente/historial' && location.pathname.startsWith('/cliente/historial')) ||
              (opt.to === '/cliente/reporte-electrico' && location.pathname.startsWith('/cliente/reporte-electrico')) ||
              (opt.to === '/cliente/reporte-bombeo' && location.pathname.startsWith('/cliente/reporte-bombeo'));
            
            return (
              <Tooltip key={opt.to} title={collapsed ? opt.label : ''} placement="right" arrow>
                <MenuOption to={opt.to} $collapsed={collapsed} $active={isActive}>
                  <FontAwesomeIcon icon={opt.icon} />
                  <span>{opt.label}</span>
                </MenuOption>
              </Tooltip>
            );
          })}
        </MenuGroup>
      </div>

      <div style={{ padding: '0 0.5rem' }}>
        <Divider sx={{ borderColor: 'rgba(0,0,0,0.1)', marginBottom: '0.5rem' }} />
        <Tooltip title={collapsed ? 'Salir' : ''} placement="right" arrow>
          <LogoutButton onClick={handleLogout} $collapsed={collapsed}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <span>Salir</span>
          </LogoutButton>
        </Tooltip>
      </div>
    </SectionMenu>
  );
};

export default MenuSideCl;