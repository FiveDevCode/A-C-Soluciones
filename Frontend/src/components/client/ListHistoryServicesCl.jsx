import BaseTable from "../common/BaseTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.8125rem;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.$status?.toLowerCase()) {
      case 'completado':
      case 'completada':
        return '#dcfce7';
      case 'en proceso':
      case 'iniciada':
      case 'iniciado':
        return '#fef3c7';
      case 'pendiente':
        return '#fee2e2';
      case 'cancelado':
      case 'cancelada':
        return '#f3f4f6';
      case 'programada':
        return '#dbeafe';
      case 'en_camino':
      case 'en camino':
        return '#e0e7ff';
      default:
        return '#e5e7eb';
    }
  }};
  color: ${(props) => {
    switch (props.$status?.toLowerCase()) {
      case 'completado':
      case 'completada':
        return '#166534';
      case 'en proceso':
      case 'iniciada':
      case 'iniciado':
        return '#854d0e';
      case 'pendiente':
        return '#991b1b';
      case 'cancelado':
      case 'cancelada':
        return '#4b5563';
      case 'programada':
        return '#1e40af';
      case 'en_camino':
      case 'en camino':
        return '#3730a3';
      default:
        return '#374151';
    }
  }};
`;

const ActionButton = styled.button`
  background-color: ${(props) => props.$variant === 'disabled' ? '#94a3b8' : '#007BFF'};
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: ${(props) => props.$variant === 'disabled' ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: ${(props) => props.$variant === 'disabled' ? 0.7 : 1};
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 auto;

  &:hover {
    background-color: ${(props) => props.$variant === 'disabled' ? '#94a3b8' : '#0056b3'};
    transform: ${(props) => props.$variant === 'disabled' ? 'none' : 'translateY(-2px)'};
    box-shadow: ${(props) => props.$variant === 'disabled' ? 'none' : '0 4px 8px rgba(0, 123, 255, 0.3)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ListHistoryServicesCl = ({ historyServices = [], onViewReport }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatStatus = (status) => {
    if (!status) return 'Pendiente';
    if (status === 'en_camino') return 'En camino';
    if (status === 'programada') return 'Programada';
    return status;
  };

  const columns = [
    { 
      header: "Fecha", 
      accessor: "fecha",
      render: (value) => formatDate(value)
    },
    { 
      header: "Servicio", 
      accessor: "servicio",
      render: (value) => value || 'N/A'
    },
    { 
      header: "Técnico", 
      accessor: "tecnico",
      render: (value) => value || 'No asignado'
    },
    {
      header: "Estado",
      accessor: "estado",
      render: (value) => (
        <StatusBadge $status={value}>
          {formatStatus(value)}
        </StatusBadge>
      )
    },
    {
      header: "Acciones",
      render: (_, row) => {
        const estadoLower = row.estado?.toLowerCase();
        const isCompleted = estadoLower === 'completada' || estadoLower === 'completado';
        
        return (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {isCompleted ? (
              <ActionButton
                onClick={() => onViewReport && onViewReport(row.visita_id, row.estado, row.pdf_path)}
              >
                <FontAwesomeIcon icon={faFilePdf} />
                Ver Ficha
              </ActionButton>
            ) : (
              <ActionButton
                $variant="disabled"
                disabled
                title="La ficha estará disponible cuando el servicio sea completado"
              >
                Ficha en Proceso
              </ActionButton>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <BaseTable
      data={historyServices}
      columns={columns}
      emptyMessage="No hay servicios en el historial."
    />
  );
};

export default ListHistoryServicesCl;

