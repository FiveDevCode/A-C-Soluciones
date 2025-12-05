import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faCheck, 
  faTrash, 
  faCheckDouble,
  faFilter,
  faInbox
} from '@fortawesome/free-solid-svg-icons';
import { handleEliminarNotificacion } from '../../controllers/common/notificacion.controller';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.2rem;
  background: ${props => props.$variant === 'primary' ? '#007BFF' : props.$variant === 'danger' ? '#dc3545' : '#6c757d'};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$variant === 'primary' ? '#0056b3' : props.$variant === 'danger' ? '#c82333' : '#5a6268'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.55rem 1rem;
    font-size: 0.85rem;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.$active ? '#007BFF' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: 1px solid ${props => props.$active ? '#007BFF' : '#dee2e6'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#0056b3' : '#e9ecef'};
  }

  @media (max-width: 768px) {
    padding: 0.45rem 0.85rem;
    font-size: 0.8rem;
  }
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 1.2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0.9rem;
    gap: 0.75rem;
  }
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${props => props.$bgColor || '#e3f2fd'};
  color: ${props => props.$color || '#1976d2'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const StatInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 0.85rem;
    color: #666;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    color: #333;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 0.75rem;
    }

    p {
      font-size: 1.3rem;
    }
  }
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NotificationCard = styled.div`
  background: ${props => props.$leida ? 'white' : '#f8f9ff'};
  border: 1px solid ${props => props.$leida ? '#e0e0e0' : '#c5cae9'};
  border-left: 4px solid ${props => props.$leida ? '#e0e0e0' : '#007BFF'};
  border-radius: 8px;
  padding: 1.2rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const NotificationMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const NotificationType = styled.span`
  font-size: 0.75rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const NotificationTime = styled.span`
  font-size: 0.8rem;
  color: #999;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.35rem;
  color: #666;
  font-size: 1rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$delete ? '#fff5f5' : '#f0f7ff'};
    color: ${props => props.$delete ? '#dc3545' : '#007BFF'};
  }
`;

const NotificationMessage = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #333;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #999;

  svg {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #666;
    font-size: 1.3rem;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem;

    svg {
      font-size: 3rem;
    }

    h3 {
      font-size: 1.1rem;
    }

    p {
      font-size: 0.85rem;
    }
  }
`;

const ConnectionIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.$conectado ? '#d4edda' : '#fff3cd'};
  color: ${props => props.$conectado ? '#155724' : '#856404'};
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$conectado ? '#28a745' : '#ffc107'};
    animation: ${props => props.$conectado ? 'none' : 'pulse 2s infinite'};
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const NotificacionesPage = () => {
  const { notificaciones, cantidadNoLeidas, conectado, marcarComoLeida, marcarTodasComoLeidas } = useNotificaciones();
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'no_leidas', 'leidas'
  const [notificacionesFiltradas, setNotificacionesFiltradas] = useState([]);

  useEffect(() => {
    let filtradas = [...notificaciones];
    
    if (filtro === 'no_leidas') {
      filtradas = filtradas.filter(n => !n.leida);
    } else if (filtro === 'leidas') {
      filtradas = filtradas.filter(n => n.leida);
    }

    setNotificacionesFiltradas(filtradas);
  }, [notificaciones, filtro]);

  const handleNotificationClick = async (notificacion) => {
    if (!notificacion.leida) {
      await marcarComoLeida(notificacion.id_notificacion);
    }
  };

  const handleDelete = async (e, idNotificacion) => {
    e.stopPropagation();
    const result = await handleEliminarNotificacion(idNotificacion);
    if (result.success) {
      window.location.reload();
    }
  };

  const handleMarkAsRead = async (e, idNotificacion) => {
    e.stopPropagation();
    await marcarComoLeida(idNotificacion);
  };

  const handleMarkAllAsRead = async () => {
    await marcarTodasComoLeidas();
  };

  const formatearFecha = (fecha) => {
    const now = new Date();
    const notifDate = new Date(fecha);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return notifDate.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const totalNotificaciones = notificaciones.length;
  const notificacionesLeidas = notificaciones.filter(n => n.leida).length;

  return (
    <Container>
      <Header>
        <Title>
          <FontAwesomeIcon icon={faBell} />
          Notificaciones
        </Title>
        <HeaderActions>
          <ConnectionIndicator $conectado={conectado}>
            {conectado ? 'Conectado en tiempo real' : 'Reconectando...'}
          </ConnectionIndicator>
          {cantidadNoLeidas > 0 && (
            <Button $variant="primary" onClick={handleMarkAllAsRead}>
              <FontAwesomeIcon icon={faCheckDouble} />
              Marcar todas como leídas
            </Button>
          )}
        </HeaderActions>
      </Header>

      <StatsBar>
        <StatCard>
          <StatIcon $bgColor="#e3f2fd" $color="#1976d2">
            <FontAwesomeIcon icon={faBell} />
          </StatIcon>
          <StatInfo>
            <h3>Total</h3>
            <p>{totalNotificaciones}</p>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon $bgColor="#fff3e0" $color="#f57c00">
            <FontAwesomeIcon icon={faInbox} />
          </StatIcon>
          <StatInfo>
            <h3>No leídas</h3>
            <p>{cantidadNoLeidas}</p>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon $bgColor="#e8f5e9" $color="#388e3c">
            <FontAwesomeIcon icon={faCheckDouble} />
          </StatIcon>
          <StatInfo>
            <h3>Leídas</h3>
            <p>{notificacionesLeidas}</p>
          </StatInfo>
        </StatCard>
      </StatsBar>

      <FilterSection>
        <FilterButton 
          $active={filtro === 'todas'} 
          onClick={() => setFiltro('todas')}
        >
          <FontAwesomeIcon icon={faFilter} /> Todas ({totalNotificaciones})
        </FilterButton>
        <FilterButton 
          $active={filtro === 'no_leidas'} 
          onClick={() => setFiltro('no_leidas')}
        >
          No leídas ({cantidadNoLeidas})
        </FilterButton>
        <FilterButton 
          $active={filtro === 'leidas'} 
          onClick={() => setFiltro('leidas')}
        >
          Leídas ({notificacionesLeidas})
        </FilterButton>
      </FilterSection>

      <NotificationsList>
        {notificacionesFiltradas.length === 0 ? (
          <EmptyState>
            <FontAwesomeIcon icon={faInbox} />
            <h3>No hay notificaciones</h3>
            <p>
              {filtro === 'no_leidas' 
                ? 'No tienes notificaciones sin leer' 
                : filtro === 'leidas'
                ? 'No tienes notificaciones leídas'
                : 'No tienes ninguna notificación por el momento'}
            </p>
          </EmptyState>
        ) : (
          notificacionesFiltradas.map((notif) => (
            <NotificationCard
              key={notif.id_notificacion}
              $leida={notif.leida}
              onClick={() => handleNotificationClick(notif)}
            >
              <NotificationHeader>
                <NotificationMeta>
                  <NotificationType>
                    {notif.tipo_notificacion?.replace(/_/g, ' ')}
                  </NotificationType>
                  <NotificationTime>
                    {formatearFecha(notif.fecha_creacion)}
                  </NotificationTime>
                </NotificationMeta>
                <NotificationActions>
                  {!notif.leida && (
                    <IconButton
                      onClick={(e) => handleMarkAsRead(e, notif.id_notificacion)}
                      title="Marcar como leída"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </IconButton>
                  )}
                  <IconButton
                    $delete
                    onClick={(e) => handleDelete(e, notif.id_notificacion)}
                    title="Eliminar"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </NotificationActions>
              </NotificationHeader>
              <NotificationMessage>{notif.mensaje}</NotificationMessage>
            </NotificationCard>
          ))
        )}
      </NotificationsList>
    </Container>
  );
};

export default NotificacionesPage;
