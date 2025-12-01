
import { Button, InputAdornment, TextField } from "@mui/material";
import styled from "styled-components";
import Logo from "../common/Logo";
import logo from "../../assets/common/logoA&C.png"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";




const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
  color: #ffffff;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #0056b3 0%, #00408a 100%);
    box-shadow: 0 6px 14px rgba(0, 86, 179, 0.35);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    gap: 0.3rem;
  }
`;

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
  @media screen and (max-width: 1350px) {
    padding: 0 2rem;
    
  }
  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 45px;
    gap: 1rem;
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
  border-bottom: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
  @media screen and (max-width: 1520px) {
    padding: 0 4rem;
    
  }
  @media screen and (max-width: 1350px) {
    padding: 0 2rem;
    
  }
  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 60px;
    gap: 0.5rem;
  }

`


const MenuOption = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.75rem;
    font-size: 0.8rem;
  }
`

const LinkOption = styled(Link)`
  text-decoration: none;
  color: #000000;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #007BFF;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    white-space: nowrap;
  }
`

const ButtonProfile = styled(Link)`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #000000;
`

const HeaderBarHome = () => {

  const navigate = useNavigate();
  
  return (
    <ContainerHeader>
      <MenuBar>
      <LoginButton to="/iniciar-sesion">
        <FaUser />
        Iniciar sesión
      </LoginButton>
      </MenuBar>
      <Menu>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Logo src={logo} size="100%" max="150px"/>
        </Link> 
        <MenuOption>
          <LinkOption to="/acerca-de-nosotros">Acerca de nosotros</LinkOption>
          <LinkOption to="/iniciar-sesion">Servicios</LinkOption>
        </MenuOption>


      </Menu>

    </ContainerHeader>
  )
}


export default HeaderBarHome;