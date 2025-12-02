import { useState, useEffect } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { useNotificaciones } from "../../hooks/useNotificaciones";
import { handleEliminarNotificacion } from "../../controllers/common/notificacion.controller";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Card = styled.div`
  background-color: white;
  margin: 0 auto 0 auto;
  align-self: center;
  padding: 20px;
  width: 85%;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);

  @media (max-width: 1350px) {
    margin: 0 10px 0 10px;
    padding: 15px;
    width: 95%;
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NotificationItem = styled.div`
  background-color: ${props => props.$isRead ? '#f9f9f9' : '#e3f2fd'};
  border-left: 4px solid ${props => props.$isRead ? '#9e9e9e' : '#2196f3'};
  padding: 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
  flex-wrap: wrap;
`;

const NotificationType = styled.span`
  font-size: 0.75rem;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    const type = props.$type?.toLowerCase();
    if (type?.includes('factura')) return '#4caf50';
    if (type?.includes('inventario')) return '#ff9800';
    if (type?.includes('servicio')) return '#2196f3';
    if (type?.includes('cliente')) return '#9c27b0';
    if (type?.includes('mantenimiento')) return '#f44336';
    return '#607d8b';
  }};
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const NotificationDescription = styled.p`
  margin: 0 0 10px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const NotificationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const NotificationDate = styled.span`
  color: #757575;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ReferenceTag = styled.span`
  font-size: 0.75rem;
  color: #666;
  background: #e0e0e0;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const StatusBadge = styled.span`
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-weight: 600;
  background: ${props => props.$read ? '#e0e0e0' : '#4caf50'};
  color: ${props => props.$read ? '#666' : 'white'};
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  color: #666;
  font-size: 0.9rem;
  transition: all 0.2s;
  border-radius: 4px;

  &:hover {
    background: ${props => props.$delete ? '#ffebee' : '#e3f2fd'};
    color: ${props => props.$delete ? '#f44336' : '#2196f3'};
  }

  @media (max-width: 768px) {
    padding: 5px 8px;
    font-size: 0.85rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #757575;
  font-size: 16px;

  @media (max-width: 768px) {
    padding: 30px;
    font-size: 15px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: ${props => props.$variant === 'danger' ? '#f44336' : '#1976d2'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$variant === 'danger' ? '#d32f2f' : '#1565c0'};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 15px;
  }
`;

const NotificationPage = () => {
  const { 
    notificaciones, 
    cantidadNoLeidas, 
    marcarComoLeida, 
    marcarTodasComoLeidas,
    cargarNotificaciones
  } = useNotificaciones();

  const [selectedIds, setSelectedIds] = useState([]);

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  const handleMarkAllRead = async () => {
    const result = await marcarTodasComoLeidas();
    if (result.success) {
      alert("Todas las notificaciones marcadas como leídas");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos una notificación para eliminar");
      return;
    }
    
    if (window.confirm(`¿Estás seguro de eliminar ${selectedIds.length} notificación(es)?`)) {
      let deletedCount = 0;
      for (const id of selectedIds) {
        const result = await handleEliminarNotificacion(id);
        if (result.success) {
          deletedCount++;
        }
      }
      
      if (deletedCount > 0) {
        alert(`${deletedCount} notificación(es) eliminada(s) correctamente`);
        await cargarNotificaciones();
        setSelectedIds([]);
      }
    }
  };

  const handleDeleteOne = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar esta notificación?')) {
      const result = await handleEliminarNotificacion(id);
      if (result.success) {
        await cargarNotificaciones();
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      }
    }
  };

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    await marcarComoLeida(id);
  };

  const handleNotificationClick = async (id) => {
    // Marcar como leída
    await marcarComoLeida(id);

    // Toggle selection
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="NOTIFICACIONES"
        sectionTitle={`Notificaciones (${cantidadNoLeidas} sin leer)`}
        showAdd={false}
      />

      <Card>
        <ButtonGroup>
          <Button onClick={handleMarkAllRead}>
            Marcar todas como leídas
          </Button>
          <Button 
            $variant="danger"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
          >
            Eliminar seleccionadas ({selectedIds.length})
          </Button>
        </ButtonGroup>

        {notificaciones.length === 0 ? (
          <EmptyState>
            No tienes notificaciones en este momento
          </EmptyState>
        ) : (
          <NotificationList>
            {notificaciones.map(notification => (
              <NotificationItem
                key={notification.id_notificacion}
                $isRead={notification.leida}
                onClick={() => handleNotificationClick(notification.id_notificacion)}
                style={{
                  border: selectedIds.includes(notification.id_notificacion) ? '2px solid #2196f3' : 'none'
                }}
              >
                <NotificationHeader>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <NotificationType $type={notification.tipo_notificacion}>
                      {notification.tipo_notificacion?.replace(/_/g, ' ') || 'NOTIFICACIÓN'}
                    </NotificationType>
                    <StatusBadge $read={notification.leida}>
                      {notification.leida ? '✓ Leída' : '● Nueva'}
                    </StatusBadge>
                  </div>
                  <NotificationActions>
                    {!notification.leida && (
                      <ActionButton
                        onClick={(e) => handleMarkAsRead(e, notification.id_notificacion)}
                        title="Marcar como leída"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </ActionButton>
                    )}
                    <ActionButton
                      $delete
                      onClick={(e) => handleDeleteOne(e, notification.id_notificacion)}
                      title="Eliminar notificación"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </ActionButton>
                  </NotificationActions>
                </NotificationHeader>
                <NotificationDescription>{notification.mensaje}</NotificationDescription>
                <NotificationMeta>
                  <NotificationDate>
                    🕒 {formatDate(notification.fecha_creacion)}
                  </NotificationDate>
                  {notification.tipo_referencia && (
                    <ReferenceTag>
                      📎 {notification.tipo_referencia}
                      {notification.id_referencia && ` #${notification.id_referencia}`}
                    </ReferenceTag>
                  )}
                </NotificationMeta>
              </NotificationItem>
            ))}
          </NotificationList>
        )}
      </Card>
    </Container>
  );
};

export default NotificationPage;
