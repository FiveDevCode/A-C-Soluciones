import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { handleGetTechnicalId } from '../../controllers/technical/getTechnicalIdTc.controller';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faIdCard, faUser, faPhone, faEnvelope, faEdit, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { Skeleton } from '@mui/material';
import { useMenu } from '../../components/technical/MenuContext';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  overflow-y: auto;
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  transition: margin-left 0.3s ease;

  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem 0.75rem 1rem 70px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin: 0 0 0.3rem 0;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin: 0 0 0.2rem 0;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
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

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
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

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
`;

const UserInfo = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    text-align: center;
    width: 100%;
  }
`;

const UserName = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.3rem 0;
  color: #2d3436;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0 0 0.4rem 0;
  }
`;

const UserRole = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.65rem;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
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

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    gap: 0.65rem;
    margin-bottom: 0.65rem;
  }
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

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    font-size: 1rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 0.85rem;
  color: #636e72;
  margin: 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    letter-spacing: 0.3px;
  }
`;

const CardValue = styled.p`
  font-size: 1.1rem;
  color: #2d3436;
  margin: 0;
  font-weight: 600;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ProfileUserTc = () => {
  const { collapsed } = useMenu();
  const [userTechnical, setUserTechnical] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const decoded = jwtDecode(token);
        const response = await handleGetTechnicalId(decoded.id);
        setUserTechnical(response.data);
      } catch (error) {
        console.error("Error fetching technical:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container $collapsed={collapsed}>
        <Header>
          <HeaderContent>
            <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
            <Skeleton variant="text" width={150} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          </HeaderContent>
        </Header>
        <Content>
          <ProfileInfo>
            <Skeleton variant="circular" width={120} height={120} />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" width={250} height={40} />
              <Skeleton variant="text" width={100} height={30} />
            </div>
            <Skeleton variant="rectangular" width={140} height={45} sx={{ borderRadius: '8px' }} />
          </ProfileInfo>
          <CardsGrid>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: '12px' }} />
            ))}
          </CardsGrid>
        </Content>
      </Container>
    );
  }

  return (
    <Container $collapsed={collapsed}>
      <Header>
        <HeaderContent>
          <Title>Mi Perfil</Title>
          <Subtitle>Información de tu cuenta de técnico</Subtitle>
        </HeaderContent>
      </Header>

      <Content>
        <ProfileInfo>
          <Avatar>
            <FontAwesomeIcon icon={faUserCircle} />
          </Avatar>
          <UserInfo>
            <UserName>{userTechnical?.nombre} {userTechnical?.apellido}</UserName>
            <UserRole>Técnico</UserRole>
          </UserInfo>
          <EditButton to="/tecnico/editar-perfil">
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
            <CardValue>{userTechnical?.numero_de_cedula?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</CardValue>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faUser} />
              </IconWrapper>
              <CardTitle>Nombre Completo</CardTitle>
            </CardHeader>
            <CardValue>{userTechnical?.nombre} {userTechnical?.apellido}</CardValue>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faPhone} />
              </IconWrapper>
              <CardTitle>Teléfono</CardTitle>
            </CardHeader>
            <CardValue>{userTechnical?.telefono}</CardValue>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faEnvelope} />
              </IconWrapper>
              <CardTitle>Correo Electrónico</CardTitle>
            </CardHeader>
            <CardValue>{userTechnical?.correo_electronico}</CardValue>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faBriefcase} />
              </IconWrapper>
              <CardTitle>Especialidad</CardTitle>
            </CardHeader>
            <CardValue>{userTechnical?.especialidad}</CardValue>
          </InfoCard>
        </CardsGrid>
      </Content>
    </Container>
  );
};

export default ProfileUserTc;