import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Skeleton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { handleChangeStateTechnical } from "../../controllers/administrator/updateStateTechnical.controller";
import { ScreenConfirmation } from "../../components/administrator/ScreenConfirmation";
import { handleGetService } from "../../controllers/administrator/getServiceAd.controller";
import logoService from "../../assets/administrator/service-view.png"
import { handleChangeStateService } from "../../controllers/administrator/updateStateServiceAd.controller";
import { useMenu } from "../../components/technical/MenuContext";

const PageContainer = styled.div`
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  padding: 2rem 4rem;
  min-height: calc(100vh);
  transition: margin-left 0.3s ease;

  @media screen and (max-width: 1520px) {
    padding: 2rem 2rem;
  }

  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
    padding: 1.5rem 1rem;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const Container = styled.div`
  padding: 0;
  width: 100%;
  max-width: 1000px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #e2e8f0;
`;

const UsuarioInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, #91cdffff 0%, #60a5fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
  border: 3px solid #ffffff;
`;

const Imagen = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

const Nombre = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a237e;
  letter-spacing: -0.02em;
`;

const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 2px solid #e2e8f0;
`;

const ContentSection = styled.div`
  padding: 2.5rem;
`;

const Seccion = styled.div`
  margin-bottom: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a237e;
  margin: 0 0 2rem 0;
  letter-spacing: -0.01em;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #91cdffff;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-left-color: #60a5fa;
  }
`;

const Label = styled.p`
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Texto = styled.p`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.6;
`;


const DetailsSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;

`



const SkeletonLoader = ({ collapsed }) => (
  <PageContainer $collapsed={collapsed}>
    <Container>
      <Header>
        <UsuarioInfo>
          <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: '16px' }} />
          <Skeleton variant="text" width={300} height={40} />
        </UsuarioInfo>
      </Header>
      <Divider />
      <ContentSection>
        <Skeleton variant="text" width={250} height={36} sx={{ marginBottom: '2rem' }} />
        <DetailsSkeleton>
          <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: '12px' }} />
          <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: '12px' }} />
          <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: '12px' }} />
        </DetailsSkeleton>
      </ContentSection>
    </Container>
  </PageContainer>
);

const ViewServicePageTc = () => {
  const { collapsed } = useMenu();
  const { id } = useParams(); 
  const [serviceData, setServiceData] = useState(null);


  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await handleGetService(id);
        setServiceData(response.data.data);  
      } catch (error) {
        console.log(error);
      }
    };

    fetchService();
  }, [id]); 

  if (!serviceData) {
    return <SkeletonLoader collapsed={collapsed} />
  }

  return (
    <PageContainer $collapsed={collapsed}>
      <Container>
        <Header>
          <UsuarioInfo>
            <IconWrapper>
              <Imagen
                src={logoService}
                alt="Servicio"
              />
            </IconWrapper>
            <Nombre>{serviceData.nombre}</Nombre>
          </UsuarioInfo>
        </Header>

        <Divider />

        <ContentSection>
          <Seccion>
            <SectionTitle>Información del servicio</SectionTitle>
            
            <InfoGrid>
              <InfoItem>
                <Label>Nombre del servicio</Label>
                <Texto>{serviceData.nombre}</Texto>
              </InfoItem>
              
              <InfoItem>
                <Label>Descripción</Label>
                <Texto>{serviceData.descripcion || "Sin descripción disponible"}</Texto>
              </InfoItem>

              <InfoItem>
                <Label>Fecha de creación</Label>
                <Texto>
                  {new Date(serviceData.fecha_creacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Texto>
              </InfoItem>
            </InfoGrid>
          </Seccion>
        </ContentSection>
      </Container>
    </PageContainer>
  );
};

export default ViewServicePageTc;