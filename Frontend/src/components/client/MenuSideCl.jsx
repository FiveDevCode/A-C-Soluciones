import Logo from '../common/Logo';
import logo from '../../assets/common/logoA&C.png';
import { Divider } from '@mui/material';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faFile, 
  faPaperPlane, 
  faDiagramProject, 
  faClockRotateLeft, 
  faGear, 
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const SectionMenu = styled.section`
  display: flex;
  flex-direction: row;
`

const ContainerMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 16%;
  padding: 0.725rem;
  gap: 1rem;
  padding-bottom: 1.5rem;
  min-width: 210px;
  max-width: 250px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0 10px 10px 0;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  height: 100%;
  background-color: #FFFFFF;
  z-index: 1500;

`

const TitleMenu = styled.h1`
  font-size: 1rem;
  font-weight: 300;
  color: #505050;

`

const ContainerAllOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.725rem;

`
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
  
`
const TitleOption = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  color: #505050;

`
const ContainerAllConfiguration = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  gap: 0.725rem;

`
const IconOption = styled(FontAwesomeIcon)`
  color: white;
  stroke: black;
  stroke-width: 15px;
  font-size: 32px;
`

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

`
const ScreenFaint = styled.div`
  background-color: rgba(0,0,0,0.35);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 1000;
  top: 0;

`

const MenuSideCl = ({ onClose }) => {
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem('userRole');
    navigate("/");
  };

  return (
    <SectionMenu>
      <ContainerMenu>
        <Link to="/home"><Logo src={logo} size="157px"/></Link>
        <TitleMenu>Menu</TitleMenu>
        <Divider/> 
        <ContainerAllOption>
          <ContainerOption to="/home">
            <IconOption 
              icon={faHouse}           
            />
            <TitleOption>Inicio</TitleOption>
          </ContainerOption>
          <ContainerOption>
            <IconOption 
              icon={faDiagramProject} 
            />
            <TitleOption>Mis solicitudes</TitleOption>
          </ContainerOption>
          <ContainerOption>
            <IconOption 
              icon={faPaperPlane} 
            />
            <TitleOption>Enviar solicitud</TitleOption>
          </ContainerOption>
          <ContainerOption>
            <IconOption 
              icon={faFile} 
            />
            <TitleOption>Mis reportes</TitleOption>
          </ContainerOption>
          <ContainerOption>
            <IconOption 
              icon={faClockRotateLeft} 
            />
            <TitleOption>Ver historial</TitleOption>
          </ContainerOption>
        </ContainerAllOption>
        

        <ContainerAllConfiguration>
          <Divider/> 
          <ContainerOption>
            <IconOption 
              icon={faGear} 
            />
            <TitleOption>Configuracion</TitleOption>
          </ContainerOption>
          <ContainerOptionClose onClick={handleLogout}>
            <IconOption 
              icon={faArrowRightFromBracket} 
              
            />
            <TitleOption>Salir</TitleOption>
          </ContainerOptionClose>
        </ContainerAllConfiguration>
      </ContainerMenu>
      <ScreenFaint onClick={onClose}/>

    </SectionMenu>
  )
}

export default MenuSideCl;