import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalendarAlt, faClipboardList, faHourglassHalf, faCheckCircle, faTimesCircle, faFileAlt } from "@fortawesome/free-solid-svg-icons";
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
  border-radius: 12px;
  padding: 1rem;
  gap: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  color: inherit;

  @media (max-width: 1350px) {
    padding: 0.8rem;
    gap: 1rem;
    border-radius: 10px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }

  @media (max-width: 768px) {
    padding: 0.65rem;
    gap: 0.75rem;
    border-radius: 8px;
  }
`;

const NotificationDescription = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  flex: 1;
  min-width: 0;

  @media (max-width: 1350px) {
    gap: 0.9rem;
  }

  @media (max-width: 768px) {
    gap: 0.65rem;
  }
`;

const IconCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  background: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'pendiente':
        return 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)';
      case 'en proceso':
      case 'en_proceso':
        return 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)';
      case 'completado':
        return 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)';
      case 'cancelado':
        return 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)';
      default:
        return 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
    }
  }};
  color: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'pendiente':
        return '#f57c00';
      case 'en proceso':
      case 'en_proceso':
        return '#1976d2';
      case 'completado':
        return '#388e3c';
      case 'cancelado':
        return '#d32f2f';
      default:
        return '#757575';
    }
  }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  @media (max-width: 1350px) {
    width: 42px;
    height: 42px;
    font-size: 1.1rem;
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

const RequestTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  svg {
    color: #667eea;
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  @media (max-width: 1350px) {
    font-size: 0.8rem;
    gap: 0.4rem;

    svg {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    gap: 0.35rem;

    svg {
      font-size: 0.7rem;
    }
  }
`;

const Description = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  word-break: break-word;

  @media (max-width: 1350px) {
    font-size: 1rem;
    line-height: 1.35;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.3;
    -webkit-line-clamp: 1;
  }
`;

const RequestMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 1350px) {
    gap: 0.7rem;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const DateBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #666;
  font-size: 0.9rem;

  svg {
    color: #667eea;
  }

  @media (max-width: 1350px) {
    font-size: 0.8rem;
    gap: 0.35rem;

    svg {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    gap: 0.3rem;

    svg {
      font-size: 0.7rem;
    }
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
  background: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'pendiente':
        return '#fff3e0';
      case 'en proceso':
      case 'en_proceso':
        return '#e3f2fd';
      case 'completado':
        return '#e8f5e9';
      case 'cancelado':
        return '#ffebee';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'pendiente':
        return '#f57c00';
      case 'en proceso':
      case 'en_proceso':
        return '#1976d2';
      case 'completado':
        return '#388e3c';
      case 'cancelado':
        return '#d32f2f';
      default:
        return '#666';
    }
  }};

  @media (max-width: 1350px) {
    padding: 0.3rem 0.75rem;
    font-size: 0.8rem;
    border-radius: 16px;
  }

  @media (max-width: 768px) {
    padding: 0.25rem 0.6rem;
    font-size: 0.7rem;
    border-radius: 12px;
  }
`;



const MoreButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.9rem 2rem;
  margin-top: 0.5rem;
  align-self: center;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  svg {
    font-size: 1rem;
  }

  @media (max-width: 1350px) {
    padding: 0.8rem 1.8rem;
    font-size: 0.95rem;
    gap: 0.5rem;

    svg {
      font-size: 0.95rem;
    }
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    border-radius: 8px;

    svg {
      font-size: 0.85rem;
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
  font-size: 1.05rem;

  @media (max-width: 1350px) {
    padding: 2.5rem 1rem;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const ActivityListAd = ({requests}) => {
  return (
    <ContainerNoti>
      {Array.isArray(requests) && requests.length > 0 ? (
        requests.slice(0, 3).map((request, index) => {
          const getStatusIcon = (status) => {
            switch(status?.toLowerCase()) {
              case 'pendiente':
                return faHourglassHalf;
              case 'en proceso':
              case 'en_proceso':
                return faClipboardList;
              case 'completado':
                return faCheckCircle;
              case 'cancelado':
                return faTimesCircle;
              default:
                return faFileAlt;
            }
          };

          return (
            <Notification key={index}>
              <NotificationDescription>
                <IconCircle status={request.estado}>
                  <FontAwesomeIcon icon={getStatusIcon(request.estado)} />
                </IconCircle>
                <NotificationInfo>
                  <Description>
                    {request.descripcion || "Sin descripción"}
                  </Description>
                  {request.comentarios && (
                    <RequestTitle>
                      {request.comentarios}
                    </RequestTitle>
                  )}
                  <RequestMeta>
                    <DateBadge>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      {new Date(request.fecha_solicitud).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </DateBadge>
                    <StatusBadge status={request.estado}>
                      {request.estado?.replace('_', ' ')}
                    </StatusBadge>
                  </RequestMeta>
                </NotificationInfo>
              </NotificationDescription>
            </Notification>
          );
        })
      ) : (
        <EmptyMessage>No hay solicitudes recientes</EmptyMessage>
      )}
      {Array.isArray(requests) && requests.length > 3 && (
        <MoreButton to="/admin/solicitudes">
          Ver todas las solicitudes
          <FontAwesomeIcon icon={faArrowRight} />
        </MoreButton>
      )}
    </ContainerNoti>
  )
}

export default ActivityListAd;
