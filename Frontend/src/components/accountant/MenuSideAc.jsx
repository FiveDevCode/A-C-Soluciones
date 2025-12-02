import logo from '../../assets/common/logoA&C.png';
import { Divider } from '@mui/material';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse,
  faFileInvoiceDollar,
  faCreditCard,
  faChartLine,
  faClipboardList,
  faBoxes,
  faBell,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';

const SectionMenu = styled.section`
  display: flex;
  flex-direction: column;
  width: 13%;
  padding: 0.5rem;
  gap: 1rem;
  padding-bottom: 1.5rem;
  min-width: 200px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0 10px 10px 0;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  min-height: 100vh;
`;

const TitleMenu = styled.h1`
  font-size: 1rem;
  font-weight: 300;
  color: #505050;
`;

const ContainerAllOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.725rem;
`;

const ContainerOption = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 0.5rem;
  color: #000000;

  & > svg {
    min-width: 32px;
    text-align: center;
  }

  &:hover {
    background: linear-gradient(90deg, #e4d9ff 0%, #f5f5ff 100%);

    h2 {
      font-weight: bold;
    }

    svg {
      color: #000000;
      stroke-width: 0;
    }
  }
`;

const TitleOption = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  color: #505050;
`;

const ContainerAllConfiguration = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  gap: 0.725rem;
`;

const IconOption = styled(FontAwesomeIcon)`
  color: white;
  stroke: black;
  stroke-width: 15px;
  font-size: 32px;
`;

const ContainerOptionClose = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  gap: 0.5rem;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 0.5rem;
  color: #000000;

  & > svg {
    min-width: 32px;
    text-align: center;
  }

  &:hover {
    background: linear-gradient(90deg, #e4d9ff 0%, #f5f5ff 100%);
    cursor: pointer;

    h2 {
      font-weight: bold;
    }

    svg {
      color: #000000;
      stroke-width: 0;
    }
  }
`;

export const MenuSideAc = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem('userRole');
    window.dispatchEvent(new Event('authChange'));
    navigate("/");
  };

  return (
    <SectionMenu>
      <Link to="/contador/inicio"><Logo src={logo} size="157px" /></Link>
      <TitleMenu>Menú</TitleMenu>
      <Divider/> 
      <ContainerAllOption>
        <ContainerOption to="/contador/inicio">
          <IconOption icon={faHouse} />
          <TitleOption>Inicio</TitleOption>
        </ContainerOption>

        <ContainerOption to="/contador/facturas">
          <IconOption icon={faFileInvoiceDollar} />
          <TitleOption>Facturas</TitleOption>
        </ContainerOption>

        <ContainerOption to="/contador/cuentas">
          <IconOption icon={faCreditCard} />
          <TitleOption>Cuentas de pago</TitleOption>
        </ContainerOption>

        <ContainerOption to="/contador/inventario">
          <IconOption icon={faBoxes} />
          <TitleOption>Inventario</TitleOption>
        </ContainerOption>

        <ContainerOption to="/contador/notificaciones">
          <IconOption icon={faBell} />
          <TitleOption>Notificaciones</TitleOption>
        </ContainerOption>
      </ContainerAllOption>

      <ContainerAllConfiguration>
        <Divider/> 
        <ContainerOptionClose onClick={handleLogout}>
          <IconOption icon={faArrowRightFromBracket} />
          <TitleOption>Salir</TitleOption>
        </ContainerOptionClose>
      </ContainerAllConfiguration>
    </SectionMenu>
  );
};
