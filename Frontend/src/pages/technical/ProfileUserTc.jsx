import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Divider } from '@mui/material';
import { handleGetTechnicalId } from '../../controllers/technical/getTechnicalIdTc.controller';
import { jwtDecode } from 'jwt-decode';



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
  width: 120px;
  height: 120px;
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

  const [userTechnical, setUserTechnical] = useState();

  useEffect(() => {

    const token = sessionStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    handleGetTechnicalId(decoded.id)
      .then((res) => {
        console.log(res)
        setUserTechnical(res.data);
      })
      .catch((err) => {
        console.error("Error fetching technical:", err);
      });
  }, []);
  
  if (!userTechnical) {
    return <p>Cargando datos del perfil...</p>;
  }

  return (
    <Main>
      <ProfileSection>
        <ProfileInfo>
          <Avatar
            src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
            alt="Avatar"
          />
          <h2>{`${userTechnical.nombre} ${userTechnical.apellido}`}</h2>
        </ProfileInfo>
      
      </ProfileSection>

      <Divider />

      <Details>
        <p><strong>Cédula:</strong><br/>{`${userTechnical.numero_de_cedula.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`}</p>
        <p><strong>Nombre:</strong><br/>{`${userTechnical.nombre} ${userTechnical.apellido}`}</p>
        <p><strong>Teléfono:</strong> <br/>{userTechnical.telefono}</p>
        <p><strong>Correo electrónico:</strong> <br/><a href={`mailto:${userTechnical.correo_electronico}`}>{userTechnical.correo_electronico}</a></p>
        <p><strong>Cargo:</strong> <br/>{userTechnical.especialidad}</p>
      </Details>
    </Main>
  );
};

export default ProfileUserTc;