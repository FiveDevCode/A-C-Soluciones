import { useState, useEffect } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";

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

const NotificationTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const NotificationDescription = styled.p`
  margin: 0 0 8px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const NotificationDate = styled.span`
  color: #757575;
  font-size: 12px;
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
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nueva factura registrada",
      description: "Se ha registrado exitosamente la factura #FAC-2025-001 para el cliente Juan Pérez.",
      date: "2025-11-30 10:30 AM",
      isRead: false
    },
    {
      id: 2,
      title: "Actualización de inventario",
      description: "El inventario ha sido actualizado. Se agregaron 5 nuevas herramientas eléctricas.",
      date: "2025-11-29 03:15 PM",
      isRead: false
    },
    {
      id: 3,
      title: "Mensaje del Administrador",
      description: "Recordatorio: Revisar las facturas pendientes antes del cierre de mes.",
      date: "2025-11-28 09:00 AM",
      isRead: true
    }
  ]);

  const [selectedIds, setSelectedIds] = useState([]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    alert("Todas las notificaciones marcadas como leídas");
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos una notificación para eliminar");
      return;
    }
    
    if (window.confirm(`¿Está seguro de que desea eliminar ${selectedIds.length} notificación(es)?`)) {
      setNotifications(prev => prev.filter(notif => !selectedIds.includes(notif.id)));
      setSelectedIds([]);
      alert("Notificaciones eliminadas correctamente");
    }
  };

  const handleNotificationClick = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );

    // Toggle selection
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="NOTIFICACIONES"
        sectionTitle={`Notificaciones (${unreadCount} sin leer)`}
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

        {notifications.length === 0 ? (
          <EmptyState>
            No tienes notificaciones en este momento
          </EmptyState>
        ) : (
          <NotificationList>
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                $isRead={notification.isRead}
                onClick={() => handleNotificationClick(notification.id)}
                style={{
                  border: selectedIds.includes(notification.id) ? '2px solid #2196f3' : 'none'
                }}
              >
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationDescription>{notification.description}</NotificationDescription>
                <NotificationDate>{notification.date}</NotificationDate>
              </NotificationItem>
            ))}
          </NotificationList>
        )}
      </Card>
    </Container>
  );
};

export default NotificationPage;
