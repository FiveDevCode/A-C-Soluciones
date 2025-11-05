import styled from 'styled-components';
import { Button, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import adminProfile from "../../assets/administrator/admin.png"
import { useNavigate } from "react-router-dom";
import { handleGetClient } from '../../controllers/administrator/getClientAd.controller';
import { jwtDecode } from 'jwt-decode';
import MenuSideCl from "../../components/client/MenuSideCl";
import HeaderBarCl from "../../components/client/HeaderBarCl";
import FooterHomeCl from '../../components/client/FooterHomeCl';
import { useMenu } from '../../components/client/MenuContext';

const PageContainer = styled.div`
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  margin-top: 145px;
  min-height: calc(100vh - 145px);
  transition: margin-left 0.3s ease;


  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
`;

const Main = styled.main`
  background: white;
  padding: 3rem 4rem;
  max-width: 1200px;
  margin: 2rem auto;
  border-radius: 12px;

  @media screen and (max-width: 1520px) {
    padding: 2.5rem 3rem;
    margin: 1.5rem;
  }

  @media screen and (max-width: 1280px) {
    padding: 2rem 2rem;
    margin: 1rem;
  }

  @media screen and (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    width: 100%;
  }
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #91cdffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const UserName = styled.h2`
  font-size: 1.75rem;
  color: #1e293b;
  font-weight: 600;
  margin: 0;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const EditButton = styled(Button)`
  && {
    background-color: #2196f3;
    color: white;
    padding: 0.625rem 1.5rem;
    border-radius: 8px;
    text-transform: none;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);

    &:hover {
      background-color: #1976d2;
      box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
    }

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
`;

const InfoSection = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: #334155;
  font-weight: 600;
  margin-bottom: 1.5rem;

  @media screen and (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.span`
  font-size: 1.125rem;
  color: #1e293b;
  word-break: break-word;

  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const EmailLink = styled.a`
  color: #2196f3;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #1976d2;
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
        <HeaderBarCl />
        <PageContainer $collapsed={collapsed}>
          <Main>
            <p>Cargando...</p>
          </Main>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <MenuSideCl />
      <HeaderBarCl />
      <PageContainer $collapsed={collapsed}>
        <Main>
          <ProfileHeader>
            <ProfileInfo>
              <Avatar
                src={adminProfile}
                alt="Avatar del usuario"
              />
              <UserName>{`${userClient.nombre} ${userClient.apellido}`}</UserName>
            </ProfileInfo>
            <EditButton onClick={() => navigate('/cliente/editar-perfil')}>
              Editar Infomarcion
            </EditButton>
          </ProfileHeader>

          <Divider sx={{ my: 2 }} />

          <InfoSection>
            <SectionTitle>Informacion personal</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Cédula:</InfoLabel>
                <InfoValue>{userClient.numero_de_cedula || 'No especificado'}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Nombre:</InfoLabel>
                <InfoValue>{userClient.nombre || 'No especificado'}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Apellido:</InfoLabel>
                <InfoValue>{userClient.apellido || 'No especificado'}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Teléfono:</InfoLabel>
                <InfoValue>{userClient.telefono || 'No especificado'}</InfoValue>
              </InfoItem>

              <InfoItem>
                <InfoLabel>Correo electrónico:</InfoLabel>
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

              <InfoItem>
                <InfoLabel>Dirección:</InfoLabel>
                <InfoValue>{userClient.direccion || 'No especificada'}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>
        </Main>
      </PageContainer>
      <FooterHomeCl />
    </>
  );
};

export default ProfilePageCl;