import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck, faTrash, faCheckDouble, faListAlt } from '@fortawesome/free-solid-svg-icons';
import { handleEliminarNotificacion } from '../../controllers/common/notificacion.controller';

const NotificationContainer = styled.div`
  position: relative;
`;

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.3rem;
  color: ${props => props.$hasUnread ? '#007BFF' : '#666'};
  transition: color 0.3s;

  &:hover {
    color: #007BFF;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.4rem;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
    font-size: 0.65rem;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 380px;
  max-height: 500px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};

  @media (max-width: 768px) {
    width: calc(100vw - 2rem);
    max-height: 70vh;
    right: -8rem;
  }
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const MarkAllButton = styled.button`
  background: none;
  border: none;
  color: #007BFF;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  background: ${props => props.$leida ? 'white' : '#f8f9ff'};
  cursor: pointer;
  transition: background 0.2s;
  position: relative;

  &:hover {
    background: ${props => props.$leida ? '#f9f9f9' : '#f0f2ff'};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 0.85rem;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const NotificationType = styled.span`
  font-size: 0.75rem;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  color: #666;
  font-size: 0.85rem;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.$delete ? '#ff4444' : '#007BFF'};
  }
`;

const NotificationMessage = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const NotificationTime = styled.span`
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.5rem;
  display: block;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const EmptyState = styled.div`
  padding: 3rem 1rem;
  text-align: center;
  color: #999;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    font-size: 0.9rem;
  }
`;

const ConnectionStatus = styled.div`
  padding: 0.5rem;
  background: ${props => props.$conectado ? '#4caf50' : '#ff9800'};
  color: white;
  text-align: center;
  font-size: 0.75rem;
  position: sticky;
  top: 57px;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.4rem;
  }
`;

const DropdownFooter = styled.div`
  padding: 0.75rem;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
  position: sticky;
  bottom: 0;
  z-index: 1;
`;

const ViewAllButton = styled.button`
  width: 100%;
  background: #007BFF;
  color: white;
  border: none;
  padding: 0.65rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.6rem;
  }
`;

const NotificationBell = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { notificaciones, cantidadNoLeidas, conectado, marcarComoLeida, marcarTodasComoLeidas } = useNotificaciones();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (notificacion) => {
    if (!notificacion.leida) {
      await marcarComoLeida(notificacion.id_notificacion);
    }
    // Aquí puedes agregar navegación según el tipo de notificación
  };

  const handleDelete = async (e, idNotificacion) => {
    e.stopPropagation();
    const result = await handleEliminarNotificacion(idNotificacion);
    if (result.success) {
      // El estado se actualizará automáticamente con el siguiente fetch
      window.location.reload(); // Temporal, mejor usar state
    }
  };

  const handleMarkAsRead = async (e, idNotificacion) => {
    e.stopPropagation();
    await marcarComoLeida(idNotificacion);
  };

  const handleMarkAllAsRead = async () => {
    await marcarTodasComoLeidas();
  };

  const handleViewAll = () => {
    setIsOpen(false);
    // Determinar ruta según el rol del usuario
    const role = localStorage.getItem('userRole');
    if (role === 'administrador') {
      navigate('/admin/notificaciones');
    } else if (role === 'tecnico') {
      navigate('/tecnico/notificaciones');
    } else if (role === 'Contador') {
      navigate('/contador/notificaciones');
    } else if (role === 'cliente') {
      navigate('/cliente/notificaciones');
    }
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
    return notifDate.toLocaleDateString();
  };

  return (
    <NotificationContainer>
      <NotificationButton
        ref={buttonRef}
        onClick={handleToggle}
        $hasUnread={cantidadNoLeidas > 0}
        aria-label="Notificaciones"
      >
        <FontAwesomeIcon icon={faBell} />
        {cantidadNoLeidas > 0 && (
          <Badge>{cantidadNoLeidas > 99 ? '99+' : cantidadNoLeidas}</Badge>
        )}
      </NotificationButton>

      <Dropdown ref={dropdownRef} $isOpen={isOpen}>
        <DropdownHeader>
          <HeaderTitle>Notificaciones</HeaderTitle>
          {cantidadNoLeidas > 0 && (
            <MarkAllButton onClick={handleMarkAllAsRead}>
              <FontAwesomeIcon icon={faCheckDouble} /> Marcar todas
            </MarkAllButton>
          )}
        </DropdownHeader>

        {!conectado && (
          <ConnectionStatus $conectado={false}>
            Reconectando...
          </ConnectionStatus>
        )}

        <NotificationList>
          {notificaciones.length === 0 ? (
            <EmptyState>No tienes notificaciones</EmptyState>
          ) : (
            notificaciones.map((notif) => (
              <NotificationItem
                key={notif.id_notificacion}
                $leida={notif.leida}
                onClick={() => handleNotificationClick(notif)}
              >
                <NotificationHeader>
                  <NotificationType>
                    {notif.tipo_notificacion?.replace(/_/g, ' ')}
                  </NotificationType>
                  <NotificationActions>
                    {!notif.leida && (
                      <ActionButton
                        onClick={(e) => handleMarkAsRead(e, notif.id_notificacion)}
                        title="Marcar como leída"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </ActionButton>
                    )}
                    <ActionButton
                      $delete
                      onClick={(e) => handleDelete(e, notif.id_notificacion)}
                      title="Eliminar"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </ActionButton>
                  </NotificationActions>
                </NotificationHeader>
                <NotificationMessage>{notif.mensaje}</NotificationMessage>
                <NotificationTime>
                  {formatearFecha(notif.fecha_creacion)}
                </NotificationTime>
              </NotificationItem>
            ))
          )}
        </NotificationList>

        {notificaciones.length > 0 && (
          <DropdownFooter>
            <ViewAllButton onClick={handleViewAll}>
              <FontAwesomeIcon icon={faListAlt} />
              Ver todas las notificaciones
            </ViewAllButton>
          </DropdownFooter>
        )}
      </Dropdown>
    </NotificationContainer>
  );
};

export default NotificationBell;
