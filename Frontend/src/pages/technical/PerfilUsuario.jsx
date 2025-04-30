import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TextField, Button, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileLink = styled.a`
  color: #1976d2;
  font-weight: 600;
  text-decoration: none;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Main = styled.main`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const Details = styled.div`
  margin-top: 1.5rem;
  color: #424242;
  font-size: 1rem;

  p {
    margin-bottom: 1rem;
  }

  strong {
    font-weight: 700;
  }

  a {
    color: #1976d2;
    text-decoration: none;
  }
`;

const PerfilUsuario = () => {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    navigate('/login');
  };

  return (
    <Container>
      <Header>
        <ProfileLink href="#">Ver perfil</ProfileLink>
        <IconsContainer>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar"
          />
          <FontAwesomeIcon icon={faBell} size="lg" />
          <FontAwesomeIcon icon={faUser} size="lg" />
        </IconsContainer>
      </Header>

      <Main>
        <ProfileSection>
          <ProfileInfo>
            <Avatar
              src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
              alt="Avatar"
            />
            <h2>María Fernanda Toro Delgado</h2>
          </ProfileInfo>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCerrarSesion}
          >
            CERRAR SESIÓN
          </Button>
        </ProfileSection>

        <Divider />

        <Details>
          <p><strong>Nombre:</strong> María Fernanda Toro Delgado</p>
          <p><strong>Dirección:</strong> Calle Las Turbinas 234, Urb. Energía Verde, Arequipa 04001, Perú</p>
          <p><strong>Correo electrónico:</strong> <a href="mailto:maria.toro@hidrosoluciones.pe">maria.toro@hidrosoluciones.pe</a></p>
          <p><strong>Teléfono:</strong> +51 312 688 3598</p>
        </Details>
      </Main>
    </Container>
  );
};

export default PerfilUsuario;