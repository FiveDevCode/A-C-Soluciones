import { TextField } from "@mui/material";
import styled from "styled-components";

const Panel = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-left: 20px;
  max-height: 600px;
  overflow-y: auto;
  width: 300px;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  background: white;
`;

const PumpingLineParams = ({ parametrosLinea, setParametros }) => {
  const update = (field, value) => {
    setParametros(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Panel>
      <h3 style={{ marginBottom: "8px", fontWeight: "600" }}>
        Parámetros de línea
      </h3>

      <Card>
        <TextField
          label="Tanque Marca"
          value={parametrosLinea.tanque_marca}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
          onChange={(e) => update("tanque_marca", e.target.value)}
        />

        <TextField
          label="Carga Determinada"
          value={parametrosLinea.tanque_carga_determinada}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
          onChange={(e) => update("tanque_carga_determinada", e.target.value)}
        />

        <TextField
          label="Carga Media"
          value={parametrosLinea.tanque_carga_media}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
          onChange={(e) => update("tanque_carga_media", e.target.value)}
        />

        <TextField
          label="Controlador Marca"
          value={parametrosLinea.controlador_marca}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
          onChange={(e) => update("controlador_marca", e.target.value)}
        />
      </Card>
    </Panel>
  );
};

export default PumpingLineParams;
