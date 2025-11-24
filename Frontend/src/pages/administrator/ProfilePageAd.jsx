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
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin: 0 0 0.3rem 0;
  font-weight: 600;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
`;

const ProfileInfo = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  flex-shrink: 0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.3rem 0;
  color: #2d3436;
`;

const UserRole = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const EditButton = styled(Link)`
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const CardTitle = styled.h3`
  font-size: 0.95rem;
  color: #636e72;
  margin: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardValue = styled.p`
  font-size: 1.3rem;
  color: #2d3436;
  margin: 0;
  font-weight: 600;
  word-break: break-word;
`;

const SkeletonLoader = () => (
  <Container>
    <Header>
      <HeaderContent>
        <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      </HeaderContent>
    </Header>
    <Content>
      <ProfileInfo>
        <Skeleton variant="circular" width={70} height={70} />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width={250} height={30} />
          <Skeleton variant="text" width={100} height={25} />
        </div>
        <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: '8px' }} />
      </ProfileInfo>
      <CardsGrid>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: '12px' }} />
        ))}
      </CardsGrid>
    </Content>
  </Container>
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
        <HeaderContent>
          <Title>Mi Perfil</Title>
          <Subtitle>Información de tu cuenta de administrador</Subtitle>
        </HeaderContent>
      </Header>

      <Content>
        <ProfileInfo>
          <Avatar>
            <img src={adminProfile} alt="Avatar" />
          </Avatar>
          <UserInfo>
            <UserName>{userAdmin?.nombre} {userAdmin?.apellido}</UserName>
            <UserRole>Administrador</UserRole>
          </UserInfo>
          <EditButton to="/admin/editar-perfil">
            <FontAwesomeIcon icon={faEdit} />
            Editar Perfil
          </EditButton>
        </ProfileInfo>

        <CardsGrid>
          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faIdCard} />
              </IconWrapper>
              <CardTitle>Cédula</CardTitle>
            </CardHeader>
            <CardValue>{userAdmin?.numero_cedula?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</CardValue>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faUser} />
              </IconWrapper>
              <CardTitle>Nombre</CardTitle>
            </CardHeader>
            <CardValue>{userAdmin?.nombre}</CardValue>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faUser} />
              </IconWrapper>
              <CardTitle>Apellido</CardTitle>
            </CardHeader>
            <CardValue>{userAdmin?.apellido}</CardValue>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faEnvelope} />
              </IconWrapper>
              <CardTitle>Correo Electrónico</CardTitle>
            </CardHeader>
            <CardValue>{userAdmin?.correo_electronico}</CardValue>
          </InfoCard>
        </CardsGrid>
      </Content>
    </Container>
  );
};

export default ProfilePageAd;