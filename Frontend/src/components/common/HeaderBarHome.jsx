
import { Button, InputAdornment, TextField } from "@mui/material";
import styled from "styled-components";
import Logo from "../common/Logo";
import logo from "../../assets/common/logoA&C.png"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const ContainerHeader = styled.div`
  display: flex;
  flex-direction: column;
  
`


const MenuBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 3rem;
  align-items: center;
  height: 50px;
  background-color: #F2F5F7;
  padding: 0 8rem;
  @media screen and (max-width: 1520px) {
    padding: 0 4rem;
    
  }
  @media screen and (max-width: 1280px) {
    padding: 0 2rem;
    
  }
  
`

const InputSearch = styled(TextField)`
  width: 15%;
  max-width: 250px;
  background-color: #f9f9f9;
  border-radius: 50px;

  & .MuiOutlinedInput-root {
    border-radius: 50px;
    padding-right: 10px;

  }
`

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 95px;
  justify-content: space-between;
  padding: 0 8rem;
  @media screen and (max-width: 1520px) {
    padding: 0 4rem;
    
  }
  @media screen and (max-width: 1280px) {
    padding: 0 2rem;
    
  }

`


const MenuOption = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;
`

const LinkOption = styled(Link)`

`

const ButtonProfile = styled(Link)`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #000000;
`

const HeaderBarHome = () => {

  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        navigate(`/resultado?data=${busqueda}`);
    }
  };

  return (
    <ContainerHeader>
      <MenuBar>
        <Button
          variant="contained" 
          size="small" 
          sx={{ 
            textTransform: 'none', 
            height: '32px', 
            paddingX: 2, 
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 500
          }}
          LinkComponent={Link}
          to="/iniciar-sesion"
        >
          Iniciar sesion
        </Button>
      </MenuBar>
      <Menu>
        <Logo src={logo} size="13%" max="150px"/> 
        <MenuOption>
          <LinkOption to="/">Acerca de nosotros</LinkOption>
          <LinkOption to="/">Servicios</LinkOption>
          <LinkOption to="/">Contacte con nosotros</LinkOption>
        </MenuOption>


      </Menu>

    </ContainerHeader>
  )
}


export default HeaderBarHome;