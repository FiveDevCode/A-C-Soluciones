import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCalendarAlt, faFileInvoice, faHourglassHalf, faCheckCircle, faTimesCircle, faFileAlt, faReceipt } from "@fortawesome/free-solid-svg-icons";

const ContainerNoti = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

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

  svg {
    color: #00b894;
    font-size: 0.85rem;
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
    color: #00b894;
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

  @media (max-width: 768px) {
    padding: 2rem 0.75rem;
    font-size: 0.9rem;
  }
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
