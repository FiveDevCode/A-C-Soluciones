import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';
import { handleGetAccountingAc } from '../../controllers/accountant/getAccountingAc.controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faIdCard, faUser, faPhone, faEnvelope, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Skeleton } from '@mui/material';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
  padding: 2rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProfileInfo = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  color: #2d3436;
`;

const UserRole = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const EditButton = styled(Link)`
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
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
    box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);
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
    box-shadow: 0 4px 16px rgba(0, 184, 148, 0.2);
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
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
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

function ProfilePageAc() {
  const [contabilidad, setContabilidad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        const decoded = jwtDecode(token);
        const response = await handleGetAccountingAc(decoded.id);
        setContabilidad(response.data);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container>
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
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: '12px' }} />
            ))}
          </CardsGrid>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Mi Perfil</Title>
          <Subtitle>Información de tu cuenta de contador</Subtitle>
        </HeaderContent>
      </Header>

      <Content>
        <ProfileInfo>
          <Avatar>
            <FontAwesomeIcon icon={faUserCircle} />
          </Avatar>
          <UserInfo>
            <UserName>{contabilidad?.nombre} {contabilidad?.apellido}</UserName>
            <UserRole>Contador</UserRole>
          </UserInfo>
          <EditButton to="/contador/editar-perfil">
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
            <CardValue>{contabilidad?.numero_de_cedula}</CardValue>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faUser} />
              </IconWrapper>
              <CardTitle>Nombre Completo</CardTitle>
            </CardHeader>
            <CardValue>{contabilidad?.nombre} {contabilidad?.apellido}</CardValue>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faPhone} />
              </IconWrapper>
              <CardTitle>Teléfono</CardTitle>
            </CardHeader>
            <CardValue>{contabilidad?.telefono}</CardValue>
          </InfoCard>

          <InfoCard>
            <CardHeader>
              <IconWrapper>
                <FontAwesomeIcon icon={faEnvelope} />
              </IconWrapper>
              <CardTitle>Correo Electrónico</CardTitle>
            </CardHeader>
            <CardValue>{contabilidad?.correo_electronico}</CardValue>
          </InfoCard>
        </CardsGrid>
      </Content>
    </Container>
  );
}

export default ProfilePageAc;
