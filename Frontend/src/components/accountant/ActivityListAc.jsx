import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalendarAlt, faFileInvoice, faHourglassHalf, faCheckCircle, faTimesCircle, faFileAlt, faReceipt } from "@fortawesome/free-solid-svg-icons";

const ContainerNoti = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Notification = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  color: inherit;

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
      case 'sin pagar':
        return 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)';
      case 'pagado':
      case 'pagada':
        return 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)';
      case 'cancelado':
      case 'cancelada':
        return 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)';
      case 'vencida':
        return 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)';
      default:
        return 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)';
    }
  }};
  color: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'pendiente':
      case 'sin pagar':
        return '#f57c00';
      case 'pagado':
      case 'pagada':
        return '#388e3c';
      case 'cancelado':
      case 'cancelada':
        return '#d32f2f';
      case 'vencida':
        return '#c2185b';
      default:
        return '#1976d2';
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
    color: #00b894;
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
    color: #00b894;
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
      case 'sin pagar':
        return '#fff3e0';
      case 'pagado':
      case 'pagada':
        return '#e8f5e9';
      case 'cancelado':
      case 'cancelada':
        return '#ffebee';
      case 'vencida':
        return '#fce4ec';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'pendiente':
      case 'sin pagar':
        return '#f57c00';
      case 'pagado':
      case 'pagada':
        return '#388e3c';
      case 'cancelado':
      case 'cancelada':
        return '#d32f2f';
      case 'vencida':
        return '#c2185b';
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
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
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
  box-shadow: 0 4px 12px rgba(0, 184, 148, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 184, 148, 0.4);
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

export const ActivityListAc = ({bills}) => {
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pendiente':
      case 'sin pagar':
        return faHourglassHalf;
      case 'pagado':
      case 'pagada':
        return faCheckCircle;
      case 'cancelado':
      case 'cancelada':
        return faTimesCircle;
      case 'vencida':
        return faFileInvoice;
      default:
        return faReceipt;
    }
  };

  return (
    <ContainerNoti>
      {Array.isArray(bills) && bills.length > 0 ? (
        bills.slice(0, 3).map((bill) => (
          <Notification key={bill.id}>
            <NotificationDescription>
              <IconCircle status={bill.estado_factura}>
                <FontAwesomeIcon icon={getStatusIcon(bill.estado_factura)} />
              </IconCircle>
              <NotificationInfo>
                <Description>
                  {bill.concepto || "Sin concepto"}
                </Description>
                <RequestTitle>
                  <FontAwesomeIcon icon={faReceipt} />
                  {bill.numero_factura || "Sin número de factura"}
                </RequestTitle>
                <RequestMeta>
                  <DateBadge>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    {new Date(bill.fecha_factura).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </DateBadge>
                  <StatusBadge status={bill.estado_factura}>
                    {bill.estado_factura?.replace('_', ' ')}
                  </StatusBadge>
                </RequestMeta>
              </NotificationInfo>
            </NotificationDescription>
          </Notification>
        ))
      ) : (
        <EmptyMessage>No hay facturas recientes</EmptyMessage>
      )}
      {Array.isArray(bills) && bills.length > 3 && (
        <MoreButton to="/contador/facturas">
          Ver todas las facturas
          <FontAwesomeIcon icon={faArrowRight} />
        </MoreButton>
      )}
    </ContainerNoti>
  );
};
