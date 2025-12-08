import styled from "styled-components";
import { Pagination, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowRight, 
  faCalendarAlt, 
  faClipboardList, 
  faClock, 
  faCheckCircle, 
  faTimesCircle,
  faTools,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

const ContainerNoti = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media screen and (max-width: 1520px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.9rem;
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.8rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }
`;

const Notification = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 150px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.$statusColor || '#667eea'};
    transition: width 0.3s ease;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: ${props => props.$statusColor || '#667eea'};

    &::before {
      width: 4px;
    }
  }

  @media (max-width: 1350px) {
    padding: 0.9rem;
    border-radius: 10px;
    min-height: 140px;
  }

  @media (max-width: 768px) {
    padding: 0.8rem;
    border-radius: 10px;
    min-height: 130px;
  }
`;

const NotificationDescription = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex: 1;

  @media (max-width: 1350px) {
    gap: 0.7rem;
    margin-bottom: 0.7rem;
  }

  @media (max-width: 768px) {
    gap: 0.65rem;
    margin-bottom: 0.65rem;
  }
`;

const IconCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: ${props => props.$bgGradient || 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'};
  color: ${props => props.$iconColor || '#1976d2'};
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 1350px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
  }
`;

const NotificationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 0;
  padding-top: 0.1rem;

  @media (max-width: 1350px) {
    gap: 0.35rem;
    padding-top: 0;
  }

  @media (max-width: 768px) {
    gap: 0.3rem;
  }
`;

const ServiceTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.1rem;

  svg {
    font-size: 0.75rem;
    flex-shrink: 0;
  }

  @media (max-width: 1350px) {
    font-size: 0.8rem;
    gap: 0.35rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const Description = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 1350px) {
    font-size: 0.85rem;
    -webkit-line-clamp: 2;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    -webkit-line-clamp: 2;
  }
`;

const NotesText = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
  color: #64748b;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 1350px) {
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 0.15rem;

  svg {
    font-size: 0.65rem;
    flex-shrink: 0;
  }

  @media (max-width: 1350px) {
    font-size: 0.7rem;
    gap: 0.3rem;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const ContainerOption = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
  margin-top: 0.7rem;
  padding-top: 0.7rem;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    gap: 0.6rem;
    margin-top: 0.6rem;
    padding-top: 0.6rem;
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.8rem;
  border-radius: 18px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => props.$bgColor || '#f5f5f5'};
  color: ${props => props.$textColor || '#666'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  @media (max-width: 1350px) {
    padding: 0.28rem 0.75rem;
    font-size: 0.7rem;
  }

  @media (max-width: 768px) {
    padding: 0.25rem 0.65rem;
    font-size: 0.65rem;
    border-radius: 14px;
  }
`;

const SeeMore = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateX(3px);
  }

  svg {
    font-size: 0.75rem;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(2px);
  }

  @media (max-width: 1350px) {
    font-size: 0.75rem;
    padding: 0.35rem 0.75rem;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.3rem 0.65rem;
  }
`;

const ITEMS_PER_PAGE = 6;

const getEstadoConfig = (estado) => {
  const configs = {
    'programada': {
      label: 'Programada',
      icon: faCalendarAlt,
      bgGradient: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
      iconColor: '#f57c00',
      statusColor: '#f57c00',
      badgeBg: '#fff3e0',
      badgeText: '#f57c00'
    },
    'en_camino': {
      label: 'En Camino',
      icon: faMapMarkerAlt,
      bgGradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
      iconColor: '#a72063',
      statusColor: '#a72063',
      badgeBg: '#f3e5f5',
      badgeText: '#a72063'
    },
    'iniciada': {
      label: 'Iniciada',
      icon: faClock,
      bgGradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      iconColor: '#1976d2',
      statusColor: '#1976d2',
      badgeBg: '#e3f2fd',
      badgeText: '#1976d2'
    },
    'completada': {
      label: 'Completada',
      icon: faCheckCircle,
      bgGradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      iconColor: '#388e3c',
      statusColor: '#388e3c',
      badgeBg: '#e8f5e9',
      badgeText: '#388e3c'
    },
    'cancelada': {
      label: 'Cancelada',
      icon: faTimesCircle,
      bgGradient: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
      iconColor: '#d32f2f',
      statusColor: '#d32f2f',
      badgeBg: '#ffebee',
      badgeText: '#d32f2f'
    }
  };
  return configs[estado?.toLowerCase()] || {
    label: estado || 'Desconocido',
    icon: faClipboardList,
    bgGradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
    iconColor: '#757575',
    statusColor: '#757575',
    badgeBg: '#f5f5f5',
    badgeText: '#666'
  };
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
        {paginatedVisit.map((visit, index) => {
          const estadoConfig = getEstadoConfig(visit.estado);
          const servicioNombre = visit.servicio?.nombre || 'Servicio no especificado';
          const notasPrevias = visit.notas_previas || 'Sin notas previas';
          const notasPosteriores = visit.notas_posteriores || 'Sin notas posteriores';

          return (
            <Notification 
              key={visit.id || index}
              $statusColor={estadoConfig.statusColor}
            >
              <NotificationDescription>
                <IconCircle 
                  $bgGradient={estadoConfig.bgGradient}
                  $iconColor={estadoConfig.iconColor}
                >
                  <FontAwesomeIcon icon={estadoConfig.icon} />
                </IconCircle>
                <NotificationInfo>
                  <ServiceTitle>
                    <FontAwesomeIcon icon={faTools} />
                    <span>{servicioNombre}</span>
                  </ServiceTitle>
                  <Description>
                    {notasPrevias.length > 60 
                      ? `${notasPrevias.slice(0, 60)}...`
                      : notasPrevias}
                  </Description>
                  {notasPosteriores !== 'Sin notas posteriores' && (
                    <NotesText>
                      {notasPosteriores.length > 50 
                        ? `${notasPosteriores.slice(0, 50)}...`
                        : notasPosteriores}
                    </NotesText>
                  )}
                  <DateContainer>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>{formatDate(visit.fecha_programada)}</span>
                  </DateContainer>
                </NotificationInfo>
              </NotificationDescription>
              <ContainerOption>
                <StatusBadge 
                  $bgColor={estadoConfig.badgeBg}
                  $textColor={estadoConfig.badgeText}
                >
                  {estadoConfig.label}
                </StatusBadge>
                <SeeMore to={`/tecnico/visita/${visit.id}`}>
                  <span>Ver más</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </SeeMore>
              </ContainerOption>
            </Notification>
          );
        })}
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
