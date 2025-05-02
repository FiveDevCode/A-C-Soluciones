import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Divider } from '@mui/material';



const Main = styled.main`
  background: white;
  padding: 2rem;
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

const ProfileUserTc = () => {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    navigate('/login');
  };

  return (
    <Main>
      <ProfileSection>
        <ProfileInfo>
          <Avatar
            src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
            alt="Avatar"
          />
          <h2>María Fernanda Toro Delgado</h2>
        </ProfileInfo>
      
      </ProfileSection>

      <Divider />

      <Details>
        <p><strong>Nombre:</strong><br/>María Fernanda Toro Delgado</p>
        <p><strong>Dirección:</strong> <br/>Calle Las Turbinas 234, Urb. Energía Verde, Arequipa 04001, Perú</p>
        <p><strong>Correo electrónico:</strong> <br/><a href="mailto:maria.toro@hidrosoluciones.pe">maria.toro@hidrosoluciones.pe</a></p>
        <p><strong>Teléfono:</strong> <br/>+51 312 688 3598</p>
      </Details>
    </Main>
  );
};

export default ProfileUserTc;