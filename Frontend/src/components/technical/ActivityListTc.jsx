import styled from "styled-components";
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


const ContainerNoti = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1350px) {
    gap: 0.8rem;
  }

  @media (max-width: 768px) {
    gap: 0.6rem;
  }
`;

const Notification = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 1.5rem;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.$statusColor || '#667eea'};
    transition: width 0.3s ease;
  }

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    border-color: ${props => props.$statusColor || '#667eea'};

    &::before {
      width: 6px;
    }
  }

  @media (max-width: 1350px) {
    padding: 1.2rem;
    gap: 1.2rem;
    border-radius: 14px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.8rem;
    border-radius: 12px;
  }
`;

const NotificationDescription = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  flex: 1;
  min-width: 0;

  @media (max-width: 1350px) {
    gap: 1rem;
  }

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  background: ${props => props.$bgGradient || 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'};
  color: ${props => props.$iconColor || '#1976d2'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 1350px) {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }
`;

const NotificationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
  min-width: 0;
  padding-top: 0.2rem;

  @media (max-width: 1350px) {
    gap: 0.5rem;
    padding-top: 0.1rem;
  }

  @media (max-width: 768px) {
    gap: 0.4rem;
    padding-top: 0;
  }
`;

const ServiceTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.2rem;

  svg {
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  @media (max-width: 1350px) {
    font-size: 0.9rem;
    gap: 0.4rem;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const Description = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 1350px) {
    font-size: 1rem;
    -webkit-line-clamp: 2;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    -webkit-line-clamp: 2;
  }
`;

const NotesText = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 1350px) {
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #94a3b8;
  font-size: 0.85rem;
  margin-top: 0.2rem;

  svg {
    font-size: 0.75rem;
    flex-shrink: 0;
  }

  @media (max-width: 1350px) {
    font-size: 0.8rem;
    gap: 0.3rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ContainerOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => props.$bgColor || '#f5f5f5'};
  color: ${props => props.$textColor || '#666'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  @media (max-width: 1350px) {
    padding: 0.35rem 0.9rem;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    padding: 0.3rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 16px;
  }
`;

const SeeMore = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateX(4px);
  }

  svg {
    font-size: 0.85rem;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(2px);
  }

  @media (max-width: 1350px) {
    font-size: 0.85rem;
    padding: 0.45rem 0.9rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const MoreButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #91cdffff 0%, #60a5fa 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.875rem 2rem;
  margin-top: 1rem;
  align-self: center;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(145, 205, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(145, 205, 255, 0.4);
  }
`;




const ActivityListTc = ({visits}) => {




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

  return (
    <ContainerNoti>
      {Array.isArray(visits) && visits.length > 0 ? (
        <>
          {visits.slice(0, 4).map((visit, index) => {
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
                      {notasPrevias.length > 80 
                        ? `${notasPrevias.slice(0, 80)}...`
                        : notasPrevias}
                    </Description>
                    {notasPosteriores !== 'Sin notas posteriores' && (
                      <NotesText>
                        {notasPosteriores.length > 60 
                          ? `${notasPosteriores.slice(0, 60)}...`
                          : notasPosteriores}
                      </NotesText>
                    )}
                    <DateContainer>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      <span>
                        {visit.fecha_programada 
                          ? new Date(visit.fecha_programada).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Fecha no disponible'}
                      </span>
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
          {visits.length > 4 && (
            <MoreButton to="/tecnico/visitas">
              Ver más visitas
              <FontAwesomeIcon icon={faArrowRight} />
            </MoreButton>
          )}
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 1rem',
          color: '#64748b',
          fontSize: '1rem'
        }}>
          No tienes ninguna actividad asignada por el momento.
        </div>
      )}
    </ContainerNoti>
  );
}


export default ActivityListTc;