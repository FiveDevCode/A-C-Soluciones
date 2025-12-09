import { useState } from "react";
import styled from "styled-components";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Chip,
  Box,
  Typography,
  Divider,
  TextField
} from "@mui/material";
import { handleUpdateStateRequest } from "../../controllers/administrator/UpdateStateRequestAd.controller";

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const Label = styled.span`
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const Value = styled.span`
  color: #333;
  font-size: 1rem;
`;

const getEstadoColor = (estado) => {
  const colores = {
    pendiente: "#ff9800",
    aceptada: "#4caf50",
    rechazada: "#f44336",
  };
  return colores[estado] || "#757575";
};

const ViewRequestDetailAd = ({ selected, onClose, onUpdate }) => {
  const [estado, setEstado] = useState(selected?.estado || "pendiente");
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMotivo, setErrorMotivo] = useState("");

  if (!selected) return null;

  const fields = [
    { label: "Servicio solicitado", value: selected.servicio_solicitud?.nombre },
    { label: "Descripción del servicio", value: selected.servicio_solicitud?.descripcion },
    { label: "Cliente", value: selected.cliente_solicitud ? `${selected.cliente_solicitud.nombre} ${selected.cliente_solicitud.apellido}` : "—" },
    { label: "Teléfono del cliente", value: selected.cliente_solicitud?.telefono },
    { label: "Descripción de la solicitud", value: selected.descripcion },
    { label: "Comentarios", value: selected.comentarios },
    {
      label: "Fecha de solicitud",
      value: selected.fecha_solicitud
        ? new Date(selected.fecha_solicitud).toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC"
          })
        : "—",
    },
    { label: "Dirección del servicio", value: selected.direccion_servicio },
    { label: "Estado", value: selected.estado, isBadge: true },
  ];

  return (
    <BaseDetailModal
      title="Detalle solicitud"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewRequestDetailAd;
