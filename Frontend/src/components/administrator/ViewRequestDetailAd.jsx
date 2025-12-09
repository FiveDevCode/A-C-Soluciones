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

  const handleEstadoChange = async (newEstado) => {
    // Si es rechazada, mostrar campo de motivo
    if (newEstado === 'rechazada') {
      setEstado(newEstado);
      setErrorMotivo("");
    } else {
      // Para otros estados, enviar directamente
      setEstado(newEstado);
      setMotivoCancelacion("");
      setErrorMotivo("");
      await enviarActualizacion(newEstado, null);
    }
  };

  const handleConfirmarCancelacion = async () => {
    // Validar que el motivo tenga al menos 5 caracteres
    if (!motivoCancelacion || motivoCancelacion.trim().length < 5) {
      setErrorMotivo("El motivo debe tener al menos 5 caracteres");
      return;
    }

    await enviarActualizacion(estado, motivoCancelacion);
  };

  const enviarActualizacion = async (nuevoEstado, motivo) => {
    setLoading(true);
    
    try {
      const payload = { estado: nuevoEstado };
      if (motivo) {
        payload.motivo_cancelacion = motivo;
      }

      await handleUpdateStateRequest(selected.id, nuevoEstado, motivo);
      alert("Estado actualizado correctamente");
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado de la solicitud");
      setEstado(selected.estado); // Revertir al estado anterior
      setMotivoCancelacion("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalle de Solicitud</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <DetailRow>
            <Label>Servicio solicitado</Label>
            <Value>{selected.servicio?.nombre || "—"}</Value>
          </DetailRow>

          <DetailRow>
            <Label>Descripción</Label>
            <Value>{selected.descripcion || "—"}</Value>
          </DetailRow>

          <DetailRow>
            <Label>Comentarios</Label>
            <Value>{selected.comentarios || "—"}</Value>
          </DetailRow>

          <DetailRow>
            <Label>Fecha de solicitud</Label>
            <Value>
              {selected.fecha_solicitud
                ? new Date(selected.fecha_solicitud).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </Value>
          </DetailRow>

          <DetailRow>
            <Label>Dirección del cliente</Label>
            <Value>{selected.direccion_servicio || "—"}</Value>
          </DetailRow>

          <Divider sx={{ my: 2 }} />

          <DetailRow>
            <Label>Estado actual</Label>
            <Chip 
              label={estado} 
              sx={{ 
                backgroundColor: getEstadoColor(estado),
                color: "white",
                fontWeight: "bold",
                width: "fit-content",
                mt: 1
              }} 
            />
          </DetailRow>

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
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={handleConfirmarCancelacion}
                disabled={loading || !motivoCancelacion || motivoCancelacion.trim().length < 5}
                sx={{ mt: 2 }}
              >
                Confirmar Rechazo
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewRequestDetailAd;
