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

const PumpingLineParams = ({ parametros, setParametros }) => {
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
          label="Voltaje línea"
          value={parametros.voltaje_linea}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
          onChange={(e) => update("voltaje_linea", e.target.value)}
        />

        <TextField
          label="Corriente línea"
          value={parametros.corriente_linea}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
          onChange={(e) => update("corriente_linea", e.target.value)}
        />

        <TextField
          label="Presión succión"
          value={parametros.presion_succion}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
          onChange={(e) => update("presion_succion", e.target.value)}
        />

        <TextField
          label="Presión descarga"
          value={parametros.presion_descarga}
          fullWidth
          size="small"
          sx={{ mb: 1 }}
          onChange={(e) => update("presion_descarga", e.target.value)}
        />

        <TextField
          label="Observaciones"
          value={parametros.observaciones}
          fullWidth
          size="small"
          multiline
          minRows={2}
          onChange={(e) => update("observaciones", e.target.value)}
        />
      </Card>
    </Panel>
  );
};

export default PumpingLineParams;
