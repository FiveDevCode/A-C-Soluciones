import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";

const Container = styled.div`
  padding: 2rem;
  width: 900px;
  margin: auto;
  background: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;


const UsuarioInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Imagen = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const Nombre = styled.h3`
  margin: 0;
  color: black;
`;

const Divider = styled.hr`
  margin: 2rem 0;
`;

const Seccion = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.p`
  font-weight: bold;
  margin: 0.5rem 0 0.2rem;
  color: black;
`;

const Texto = styled.p`
  margin: 0;
  color: black;
`;

const Correo = styled.a`
  color: #1976d2;
  text-decoration: none;
`;

const Footer = styled.div`
  text-align: left;
`;

const UserProfileAd = () => {
  return (
    <Container>
      <Header>
        <UsuarioInfo>
          <Imagen
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="usuario"
          />
          <Nombre>Andrés Felipe Gómez</Nombre>
        </UsuarioInfo>
        <Button variant="contained" color="error"
        style={{marginTop:"70px", marginRight:"15rem", width:"15rem"}}>
          DESHABILITAR
        </Button>
      </Header>

      <Divider />

      <Seccion>
        <Label style={{marginBottom:"30px"}}>Informacion personal</Label>

        <Label>Nombre:</Label>
        <Texto>Andrés Felipe Gómez</Texto>

        <Label>Cedula:</Label>
        <Texto>1.034.567.890</Texto>

        <Label>Telefono:</Label>
        <Texto>+57 310 456 7890</Texto>

        <Label>Cargo:</Label>
        <Texto>Ingeniero de Mantenimiento Hidroeléctrico</Texto>

        <Label>Correo electronico:</Label>
        <Correo href="mailto:andres.gomez@hidroandes.com.co">
          andres.gomez@hidroandes.com.co
        </Correo>
      </Seccion>

      <Footer>
        <Button variant="contained" color="primary"
        style={{width:"15rem"}}>
          EDITAR
        </Button>
      </Footer>
    </Container>
  );
};

export default UserProfileAd;
