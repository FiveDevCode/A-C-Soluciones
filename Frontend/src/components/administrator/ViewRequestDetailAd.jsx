import { useState } from "react";
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  TextField
} from "@mui/material";
import { handleUpdateStateRequest } from "../../controllers/administrator/UpdateStateRequestAd.controller";
import BaseDetailModal from "../common/BaseDetailModal";

const ViewRequestDetailAd = ({ selected, onClose, onUpdate }) => {
  const [estado, setEstado] = useState(selected?.estado || "pendiente");
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMotivo, setErrorMotivo] = useState("");

  if (!selected) return null;

  const handleEstadoChange = async (newEstado) => {
    if (newEstado === 'rechazada') {
      setEstado(newEstado);
      setErrorMotivo("");
    } else {
      setEstado(newEstado);
      setMotivoCancelacion("");
      setErrorMotivo("");
      await enviarActualizacion(newEstado, null);
    }
  };

  const handleConfirmarCancelacion = async () => {
    if (!motivoCancelacion || motivoCancelacion.trim().length < 5) {
      setErrorMotivo("El motivo debe tener al menos 5 caracteres");
      return;
    }
    await enviarActualizacion(estado, motivoCancelacion);
  };

  const enviarActualizacion = async (nuevoEstado, motivo) => {
    setLoading(true);
    
    try {
      await handleUpdateStateRequest(selected.id, nuevoEstado, motivo);
      alert("Estado actualizado correctamente");
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado de la solicitud");
      setEstado(selected.estado);
      setMotivoCancelacion("");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { 
      label: "Servicio solicitado", 
      value: selected.servicio_solicitud?.nombre 
    },
    { 
      label: "Descripción del servicio", 
      value: selected.servicio_solicitud?.descripcion 
    },
    { 
      label: "Cliente", 
      value: selected.cliente_solicitud 
        ? `${selected.cliente_solicitud.nombre} ${selected.cliente_solicitud.apellido}` 
        : null
    },
    { 
      label: "Teléfono del cliente", 
      value: selected.cliente_solicitud?.telefono 
    },
    { 
      label: "Descripción de la solicitud", 
      value: selected.descripcion 
    },
    { 
      label: "Comentarios", 
      value: selected.comentarios 
    },
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
        : null,
    },
    { 
      label: "Dirección del servicio", 
      value: selected.direccion_servicio 
    },
    { 
      label: "Estado actual", 
      value: estado, 
      isBadge: true 
    },
  ];

  const additionalContent = (
    <>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Cambiar estado</InputLabel>
        <Select
          value={estado}
          label="Cambiar estado"
          onChange={(e) => handleEstadoChange(e.target.value)}
          disabled={loading}
        >
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="aceptada">Aceptada</MenuItem>
          <MenuItem value="rechazada">Rechazada</MenuItem>
        </Select>
      </FormControl>

      {estado === 'rechazada' && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Motivo de rechazo *"
            placeholder="Explica por qué se rechaza esta solicitud (mínimo 5 caracteres)"
            value={motivoCancelacion}
            onChange={(e) => {
              setMotivoCancelacion(e.target.value);
              if (e.target.value.trim().length >= 5) {
                setErrorMotivo("");
              }
            }}
            error={!!errorMotivo}
            helperText={errorMotivo}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#f44336',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#f44336',
              },
            }}
          />
        </Box>
      )}
    </>
  );

  return (
    <BaseDetailModal
      title="Detalle de Solicitud"
      fields={fields}
      onClose={onClose}
      showDivider={true}
      additionalContent={additionalContent}
      primaryButton={estado === 'rechazada' ? {
        label: "Confirmar Rechazo",
        color: "error",
        variant: "contained",
        onClick: handleConfirmarCancelacion,
        disabled: loading || !motivoCancelacion || motivoCancelacion.trim().length < 5
      } : {
        label: "Cerrar",
        color: "error",
        variant: "contained",
        onClick: onClose
      }}
    />
  );
};

export default ViewRequestDetailAd;