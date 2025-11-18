import { TextField, Button } from "@mui/material";
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

const VerificationList = ({ verificaciones, setVerificaciones }) => {
  const add = () => {
    setVerificaciones(prev => [...prev, { item: "", visto: false, observacion: "" }]);
  };

  const update = (i, field, value) => {
    const copy = [...verificaciones];
    copy[i][field] = value;
    setVerificaciones(copy);
  };

  const remove = (i) => {
    setVerificaciones(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <Panel>
      <h3 style={{ marginBottom: "8px", fontWeight: "600" }}>Verificaciones</h3>

      {verificaciones.map((v, i) => (
        <Card key={i}>
          <TextField
            label="Ítem"
            value={v.item}
            fullWidth
            size="small"
            onChange={(e) => update(i, "item", e.target.value)}
            sx={{ mb: 1 }}
          />

          <TextField
            label="Observación"
            value={v.observacion}
            fullWidth
            size="small"
            multiline
            minRows={2}
            onChange={(e) => update(i, "observacion", e.target.value)}
          />

          <label style={{ display: "flex", marginTop: "8px" }}>
            <input
              type="checkbox"
              checked={v.visto}
              onChange={(e) => update(i, "visto", e.target.checked)}
            />
            <span style={{ marginLeft: "6px" }}>Visto</span>
          </label>

          <Button
            fullWidth
            variant="contained"
            color="error"
            sx={{ mt: 1, textTransform: "none" }}
            onClick={() => remove(i)}
          >
            Eliminar
          </Button>
        </Card>
      ))}

      <Button variant="contained" fullWidth sx={{ mt: 2, textTransform: "none" }} onClick={add}>
        Agregar verificación
      </Button>
    </Panel>
  );
};

export default VerificationList;
