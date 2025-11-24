import styled from "styled-components";
import serviceTehc from "../../assets/technical/serviceTehc.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Pagination, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";

const ContainerNoti = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media screen and (max-width: 1520px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.25rem;
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Notification = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  min-height: 200px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #91cdffff 0%, #60a5fa 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #91cdffff;
    transform: translateY(-4px);

    &::before {
      transform: scaleX(1);
    }
  }
`;

const NotificationDescription = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex: 1;
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NotificationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const TitleNoti = styled.h3`
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Date = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: #94a3b8;
  margin: 0;
  margin-top: auto;
`;

const ContainerOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const SeeMore = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #91cdffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e3f2fd;
    color: #60a5fa;
  }
`;

const ITEMS_PER_PAGE = 6;

const ListServiceTc = ({services}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return services.slice(start, start + ITEMS_PER_PAGE);
  }, [services, currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString.substring(0, 10);
    }
  };

  return (
    <>
      <ContainerNoti>
        {paginatedServices.map((service, index) => (
          <Notification key={service.id || index}>
            <NotificationDescription>
              <ImageWrapper>
                <img src={serviceTehc} alt="Servicio" />
              </ImageWrapper>
              <NotificationInfo>
                <TitleNoti>
                  {service.nombre && service.nombre.length > 50
                    ? `${service.nombre.slice(0, 50)}...`
                    : service.nombre || "Sin nombre"}
                </TitleNoti>
                <Description>
                  {service.descripcion && service.descripcion.length > 50
                    ? `${service.descripcion.slice(0, 50)}...`
                    : service.descripcion || "Sin descripción"}
                </Description>
                <Date>{formatDate(service.fecha_creacion)}</Date>
              </NotificationInfo>
            </NotificationDescription>
            <ContainerOption>
              <SeeMore to={`/tecnico/servicio/${service.id}`}>
                <span>Ver</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </SeeMore>
            </ContainerOption>
          </Notification>
        ))}
      </ContainerNoti>
      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '0.95rem',
                '&.Mui-selected': {
                  backgroundColor: '#91cdffff',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#60a5fa',
                  },
                },
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                },
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              mt: 1
            }}
          >
            Página {currentPage} de {totalPages}
          </Typography>
        </Stack>
      )}
    </>
  );
};


export default ListServiceTc