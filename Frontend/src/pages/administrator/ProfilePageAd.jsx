import styled from 'styled-components';
import { Skeleton } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { handleGetAdminId } from '../../controllers/administrator/getAdminIdAd.controller';
import adminProfile from "../../assets/administrator/admin.png"
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faIdCard, faEdit } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 2rem;

  @media (max-width: 1350px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const UserInfo = styled.div`
  h1 {
    font-size: 2rem;
    margin: 0 0 0.3rem 0;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
`;

const EditButton = styled(Link)`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #667eea;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const InfoCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  color: #667eea;

  svg {
    font-size: 1.5rem;
  }

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
  }
`;

const CardContent = styled.div`
  p {
    margin: 0.5rem 0 0 0;
    font-size: 1.1rem;
    color: #555;
    word-break: break-word;
  }

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SkeletonContainer = styled(Container)``;

const SkeletonLoader = () => (
  <SkeletonContainer>
    <Skeleton variant="rectangular" width="100%" height={150} style={{ borderRadius: '12px' }} />
    <CardsGrid>
      <Skeleton variant="rectangular" width="100%" height={120} style={{ borderRadius: '12px' }} />
      <Skeleton variant="rectangular" width="100%" height={120} style={{ borderRadius: '12px' }} />
      <Skeleton variant="rectangular" width="100%" height={120} style={{ borderRadius: '12px' }} />
      <Skeleton variant="rectangular" width="100%" height={120} style={{ borderRadius: '12px' }} />
    </CardsGrid>
  </SkeletonContainer>
);



const ProfilePageAd = () => {
  const [userAdmin, setUserAdmin] = useState();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    handleGetAdminId(decoded.id)
      .then((res) => {
        setUserAdmin(res.data);
      })
      .catch((err) => {
        console.error("Error fetching admin:", err);
      });
  }, []);
  
  if (!userAdmin) {
    return <SkeletonLoader />;
  }

  return (
    <Container>
      <Header>
        <ProfileInfo>
          <Avatar src={adminProfile} alt="Avatar" />
          <UserInfo>
            <h1>{`${userAdmin.nombre} ${userAdmin.apellido}`}</h1>
            <p>Administrador</p>
          </UserInfo>
        </ProfileInfo>
        <EditButton to="/admin/editar-perfil">
          <FontAwesomeIcon icon={faEdit} />
          Editar información
        </EditButton>
      </Header>

      <CardsGrid>
        <InfoCard>
          <CardHeader>
            <FontAwesomeIcon icon={faIdCard} />
            <h3>Cédula</h3>
          </CardHeader>
          <CardContent>
            <p>{userAdmin.numero_cedula.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
          </CardContent>
        </InfoCard>

        <InfoCard>
          <CardHeader>
            <FontAwesomeIcon icon={faUser} />
            <h3>Nombre Completo</h3>
          </CardHeader>
          <CardContent>
            <p>{`${userAdmin.nombre} ${userAdmin.apellido}`}</p>
          </CardContent>
        </InfoCard>

        <InfoCard>
          <CardHeader>
            <FontAwesomeIcon icon={faPhone} />
            <h3>Teléfono</h3>
          </CardHeader>
          <CardContent>
            <p>{userAdmin.telefono}</p>
          </CardContent>
        </InfoCard>

        <InfoCard>
          <CardHeader>
            <FontAwesomeIcon icon={faEnvelope} />
            <h3>Correo Electrónico</h3>
          </CardHeader>
          <CardContent>
            <p>
              <a href={`mailto:${userAdmin.correo_electronico}`}>
                {userAdmin.correo_electronico}
              </a>
            </p>
          </CardContent>
        </InfoCard>
      </CardsGrid>
    </Container>
  );
};

export default ProfilePageAd;