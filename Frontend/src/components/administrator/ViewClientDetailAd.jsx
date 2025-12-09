import BaseDetailModal from "../common/BaseDetailModal";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { FileText } from "lucide-react";
import styled from "styled-components";

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
`;

const stateLabels = {
  activo: "Activo",
  inactivo: "Inactivo",
};

const tipoClienteLabels = {
  regular: "Regular (Con visitas)",
  fijo: "Fijo (Sin visitas)"
};

const ViewClientDetailAd = ({ selected, onClose }) => {
  const navigate = useNavigate();
  
  if (!selected) return null;

  const formatDateCO = (value) => {
    if (!value) return "—";
    // Convertir string UTC a Date
    const utcDate = new Date(value);
    // Obtener los componentes UTC
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth();
    const day = utcDate.getUTCDate();
    const hour = utcDate.getUTCHours();
    const minute = utcDate.getUTCMinutes();
    // Ajustar hora Colombia (UTC-5)
    const localDate = new Date(Date.UTC(year, month, day, hour, minute));
    return localDate.toLocaleString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const fields = [
    { label: "Cédula", value: selected.numero_de_cedula },
    { label: "Nombre", value: selected.nombre },
    { label: "Apellido", value: selected.apellido },
    { label: "Teléfono", value: selected.telefono },
    { label: "Dirección", value: selected.direccion },
    { label: "Correo electrónico", value: selected.correo_electronico },
    { label: "Fecha de registro", value: formatDateCO(selected.fecha_registro) },
    { label: "Tipo de Cliente", value: tipoClienteLabels[selected.tipo_cliente] || selected.tipo_cliente, isBadge: true },
    { label: "Estado", value: stateLabels[selected.estado] || selected.estado, isBadge: true },
  ];

  const handleViewHistory = () => {
    navigate(`/admin/clientes/${selected.id}/historial-fichas`);
  };

  return (
    <BaseDetailModal
      title="Detalle cliente"
      fields={fields}
      onClose={onClose}
      additionalContent={
        selected.tipo_cliente === 'fijo' && (
          <ButtonContainer>
            <Button
              variant="contained"
              startIcon={<FileText size={20} />}
              onClick={handleViewHistory}
              fullWidth
            >
              Ver Historial de Fichas de Mantenimiento
            </Button>
          </ButtonContainer>
        )
      }
    />
  );
};

export default ViewClientDetailAd;
