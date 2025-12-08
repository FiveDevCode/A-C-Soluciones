import { Divider } from "@mui/material";
import { forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  @media screen and (max-width: 1350px) {
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

const OptionClose = styled.button`
  display: flex;
  padding: 0 1rem 0 1rem;
  color: #505050;
  background-color: #FFFFFF;
  cursor: pointer;
  border: unset;
`




const FloatingMenuHomeCl = forwardRef((props, ref) => {


  const { handleLogout } = props;

  return (
    <ContainerFloating ref={ref} data-testid="floating-menu">
      <Option to="/cliente/perfil">
        <OptionText>Perfil</OptionText>
      </Option>
      <Divider />
      <OptionClose onClick={handleLogout}>
        <OptionText>Cerrar sesión</OptionText>
      </OptionClose>
    </ContainerFloating>
  )
});


export default FloatingMenuHomeCl;
