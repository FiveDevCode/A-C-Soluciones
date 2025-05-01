import Logo from './Logo';
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
import { Link } from 'react-router-dom';

const SectionMenu = styled.section`
  display: flex;
  flex-direction: column;
  width: 13%;
  padding: 0.5rem;
  gap: 1rem;
  padding-bottom: 1.5rem;
  height: 100vh;
  min-width: 200px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0 10px 10px 0;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

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
  gap: 1rem;
  height: 100vh;
  justify-content: flex-end;
  gap: 0.725rem;

`
const IconOption = styled(FontAwesomeIcon)`
  color: white;
  stroke: black;
  stroke-width: 15px;
  font-size: 32px;
`


const MenuSide = () => {
  return (
    <SectionMenu>
      <Link to="/"><Logo src={logo} size="157px"/></Link>
      <TitleMenu>Menu</TitleMenu>
      <Divider/> 
      <ContainerAllOption>
        <ContainerOption to="/">
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
        <ContainerOption>
          <IconOption 
            icon={faArrowRightFromBracket} 
          />
          <TitleOption>Salir</TitleOption>
        </ContainerOption>
      </ContainerAllConfiguration>

    </SectionMenu>
  )
}

export default MenuSide;