import { Divider } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";



const ContainerFloating = styled.section`
  position: absolute;
  top: 55px;
  left: calc(100vw - 290px);
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(0,0,0);
  border-radius: 5px;
  gap: 0.425rem;
  width: 170px;
  padding: 0.5rem 0;
  z-index: 1000;
  background-color: #FFFFFF;

  @media screen and (max-width: 1520px) {
    left: calc(100vw - 226px);
  }
  @media screen and (max-width: 1280px) {
    left: calc(100vw - 194px);
  }

  

`;

const Option = styled(Link)`
  display: flex;
  padding: 0 1rem 0 1rem;
  color: #505050;
`;

const OptionText = styled.h2`
  font-size: 1rem;
  font-weight: bold;
`;





const FloatingMenuHomeCl = () => {
  return (
    <ContainerFloating data-testid="floating-menu">
      <Option to="/accesibility">
        <OptionText>Accesibilidad</OptionText>
      </Option>
      <Divider />
      <Option to="/profile">
        <OptionText>Perfil</OptionText>
      </Option>
      <Option to="/notifications">
        <OptionText>Notificaciones</OptionText>
      </Option>
      <Option to="/reports">
        <OptionText>Informes</OptionText>
      </Option>
      <Divider />
      <Option to="/preferences">
        <OptionText>Preferencias</OptionText>
      </Option>
      <Option to="/dark-mode">
        <OptionText>Modo Oscuro</OptionText>
      </Option>
      <Divider />
      <Option to="/logout">
        <OptionText>Cerrar sesión</OptionText>
      </Option>
    </ContainerFloating>
  )
}


export default FloatingMenuHomeCl;
