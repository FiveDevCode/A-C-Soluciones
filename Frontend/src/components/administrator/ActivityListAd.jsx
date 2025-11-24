import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalendarAlt, faClipboardList, faHourglassHalf, faCheckCircle, faTimesCircle, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const ContainerNoti = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Notification = styled(Link)`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  gap: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #667eea;
    background: #fafbff;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NotificationDescription = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  flex: 1;
  min-width: 0;
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

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
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
`;

const RequestTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;

  svg {
    color: #667eea;
    font-size: 0.85rem;
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
`;

const RequestMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
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
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
  font-size: 1.05rem;
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
            <Notification key={index} to={`/admin/solicitud/${request.id}`}>
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
                      {request.comentarios.length > 80
                        ? `${request.comentarios.slice(0, 80)}...`
                        : request.comentarios}
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
