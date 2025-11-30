import styled from 'styled-components';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import adminProfile from "../../assets/administrator/admin.png"
import { useNavigate } from "react-router-dom";
import { handleGetClient } from '../../controllers/administrator/getClientAd.controller';
import { jwtDecode } from 'jwt-decode';
import MenuSideCl from "../../components/client/MenuSideCl";
import { useMenu } from '../../components/client/MenuContext';

const PageContainer = styled.div`
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  margin-top: 0;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
`;

const WelcomeSection = styled.header`
  background-color: #007BFF;
  color: white;
  padding: 2rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 1350px) {
    padding: 1.2rem;
    font-size: 18px;
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
    font-size: 16px;
  }
`;

const Main = styled.main`
  background: white;
  padding: 2rem 2.5rem;
  margin: 1.5rem auto;
  max-width: 1200px;
  width: calc(100% - 4rem);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 2.5rem;
  min-height: calc(100vh - 180px);
  max-height: calc(100vh - 180px);
  overflow: hidden;

  @media screen and (max-width: 1520px) {
    padding: 1.75rem 2rem;
    margin: 1.25rem auto;
    width: calc(100% - 3rem);
    gap: 2rem;
  }

  @media screen and (max-width: 1280px) {
    padding: 1.5rem;
    margin: 1.25rem 1rem;
    width: calc(100% - 2rem);
    gap: 1.5rem;
    flex-direction: column;
    max-height: none;
    min-height: auto;
  }

  @media screen and (max-width: 768px) {
    padding: 1.25rem;
    margin: 1rem;
    width: calc(100% - 2rem);
    gap: 1.25rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 260px;
  max-width: 300px;
  padding-right: 1.5rem;
  border-right: 2px solid #e5e7eb;

  @media screen and (max-width: 1280px) {
    min-width: 100%;
    max-width: 100%;
    padding-right: 0;
    padding-bottom: 1.5rem;
    border-right: none;
    border-bottom: 2px solid #e5e7eb;
    align-items: center;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;

    &:hover {
      background: #94a3b8;
    }
  }

  @media screen and (max-width: 1280px) {
    overflow-y: visible;
    padding-right: 0;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #007BFF;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.2);
  object-fit: cover;

  @media screen and (max-width: 1280px) {
    width: 130px;
    height: 130px;
  }

  @media screen and (max-width: 768px) {
    width: 110px;
    height: 110px;
  }
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  color: #1e293b;
  font-weight: 700;
  margin: 0;
  text-align: center;
  line-height: 1.3;

  @media screen and (max-width: 768px) {
    font-size: 1.35rem;
  }
`;

const EditButton = styled(Button)`
  && {
    background-color: #007BFF;
    color: white;
    padding: 0.625rem 1.75rem;
    border-radius: 10px;
    text-transform: none;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    margin-top: 0.25rem;
    width: 100%;
    max-width: 220px;

    &:hover {
      background-color: #0056b3;
      box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
      transform: translateY(-2px);
    }

    @media screen and (max-width: 1280px) {
      max-width: 100%;
    }
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.35rem;
  color: #1e293b;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #007BFF;

  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media screen and (max-width: 768px) {
    gap: 1rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 10px;
  border-left: 4px solid #007BFF;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    transform: translateX(4px);
  }
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
  word-break: break-word;
  line-height: 1.4;

  @media screen and (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const EmailLink = styled.a`
  color: #007BFF;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

const ProfilePageCl = () => {
  const navigate = useNavigate();
  const { collapsed } = useMenu();
  const [userClient, setUserClient] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate('/');
      return;
    }

    const decoded = jwtDecode(token);
    const id = decoded.id;

    handleGetClient(id)
      .then((res) => {
        setUserClient(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar el cliente:", err);
      });
  }, [navigate]);

  if (!userClient) {
    return (
      <>
        <MenuSideCl />
        <PageContainer $collapsed={collapsed}>
          <WelcomeSection>
            PERFIL
          </WelcomeSection>
          <Main>
            <p style={{ textAlign: 'center', width: '100%', color: '#64748b' }}>Cargando...</p>
          </Main>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <MenuSideCl />
      <PageContainer $collapsed={collapsed}>
        <WelcomeSection>
          PERFIL
        </WelcomeSection>
        <Main>
          <LeftColumn>
            <AvatarContainer>
              <Avatar
                src={adminProfile}
                alt="Avatar del usuario"
              />
              <UserName>{`${userClient.nombre} ${userClient.apellido}`}</UserName>
              <EditButton onClick={() => navigate('/cliente/editar-perfil')}>
                Editar Información
              </EditButton>
            </AvatarContainer>
          </LeftColumn>

          <RightColumn>
            <InfoSection>
              <SectionTitle>Información Personal</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Cédula</InfoLabel>
                  <InfoValue>{userClient.numero_de_cedula || 'No especificado'}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Nombre</InfoLabel>
                  <InfoValue>{userClient.nombre || 'No especificado'}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Apellido</InfoLabel>
                  <InfoValue>{userClient.apellido || 'No especificado'}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Teléfono</InfoLabel>
                  <InfoValue>{userClient.telefono || 'No especificado'}</InfoValue>
                </InfoItem>

                <InfoItem style={{ gridColumn: '1 / -1' }}>
                  <InfoLabel>Correo Electrónico</InfoLabel>
                  <InfoValue>
                    {userClient.correo_electronico ? (
                      <EmailLink href={`mailto:${userClient.correo_electronico}`}>
                        {userClient.correo_electronico}
                      </EmailLink>
                    ) : (
                      'No especificado'
                    )}
                  </InfoValue>
                </InfoItem>

                <InfoItem style={{ gridColumn: '1 / -1' }}>
                  <InfoLabel>Dirección</InfoLabel>
                  <InfoValue>{userClient.direccion || 'No especificada'}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoSection>
          </RightColumn>
        </Main>
      </PageContainer>
    </>
  );
};

export default ProfilePageCl;
