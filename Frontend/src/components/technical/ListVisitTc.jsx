import styled from "styled-components";
import serviceTehc from "../../assets/technical/serviceTehc.png";
import { FormControl, Pagination, TextField, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
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
  min-height: 220px;
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
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  gap: 1rem;
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

const getEstadoLabel = (estado) => {
  const estados = {
    'programada': 'Programada',
    'en_camino': 'En camino',
    'iniciada': 'Iniciada',
    'completada': 'Completada',
    'cancelada': 'Cancelada'
  };
  return estados[estado] || estado;
};

const getEstadoColor = (estado) => {
  const colores = {
    'programada': '#4a8838',
    'en_camino': '#a72063',
    'iniciada': '#3151aa',
    'completada': '#21da21',
    'cancelada': '#b8103a'
  };
  return colores[estado] || '#64748b';
};

const ListVisitTc = ({visits}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(visits.length / ITEMS_PER_PAGE);

  const paginatedVisit = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return visits.slice(start, start + ITEMS_PER_PAGE);
  }, [visits, currentPage]);

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
        {paginatedVisit.map((visit, index) => (
          <Notification key={visit.id || index}>
            <NotificationDescription>
              <ImageWrapper>
                <img src={serviceTehc} alt="Visita" />
              </ImageWrapper>
              <NotificationInfo>
                <TitleNoti>
                  {visit.notas_posteriores && visit.notas_posteriores.length > 50
                    ? `${visit.notas_posteriores.slice(0, 50)}...`
                    : visit.notas_posteriores || "Sin notas posteriores"}
                </TitleNoti>
                <Description>
                  {visit.notas_previas && visit.notas_previas.length > 50
                    ? `${visit.notas_previas.slice(0, 50)}...`
                    : visit.notas_previas || "Sin notas previas"}
                </Description>
                <Date>{formatDate(visit.fecha_programada)}</Date>
              </NotificationInfo>
            </NotificationDescription>
            <ContainerOption>
              <FormControl sx={{ minWidth: "120px", flex: 1 }}>
                <TextField
                  value={getEstadoLabel(visit.estado)}
                  label="Estado"
                  disabled
                  size="small"
                  sx={{
                    '& .MuiInputBase-root': {
                      color: getEstadoColor(visit.estado),
                      fontWeight: 600,
                    }
                  }}
                />
              </FormControl>
              <SeeMore to={`/tecnico/visita/${visit.id}`}>
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

export default ListVisitTc;
