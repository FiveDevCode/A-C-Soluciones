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

const PumpingEquipmentList = ({ equipos, setEquipos }) => {
  const add = () => {
    setEquipos(prev => [
      ...prev,
      {
        equipo: "",
        marca: "",
        amperaje: "",
        presion: "",
        temperatura: "",
        estado: "",
        observacion: ""
      }
    ]);
  };

  const update = (i, field, value) => {
    const copy = [...equipos];
    copy[i][field] = value;
    setEquipos(copy);
  };

  const remove = (i) => {
    setEquipos(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <Panel>
      <h3 style={{ marginBottom: "8px", fontWeight: "600" }}>Equipos</h3>

      {equipos.map((e, i) => (
        <Card key={i}>
          <TextField
            label="Equipo"
            value={e.equipo}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(ev) => update(i, "equipo", ev.target.value)}
          />

          <TextField
            label="Marca"
            value={e.marca}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(ev) => update(i, "marca", ev.target.value)}
          />

          <TextField
            label="Amperaje"
            value={e.amperaje}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(ev) => update(i, "amperaje", ev.target.value)}
          />

          <TextField
            label="Presión"
            value={e.presion}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(ev) => update(i, "presion", ev.target.value)}
          />

          <TextField
            label="Temperatura"
            value={e.temperatura}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(ev) => update(i, "temperatura", ev.target.value)}
          />

          <TextField
            label="Estado"
            value={e.estado}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(ev) => update(i, "estado", ev.target.value)}
          />

          <TextField
            label="Observación"
            value={e.observacion}
            fullWidth
            size="small"
            multiline
            minRows={2}
            onChange={(ev) => update(i, "observacion", ev.target.value)}
          />

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

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, textTransform: "none" }}
        onClick={add}
      >
        Agregar equipo
      </Button>
    </Panel>
  );
};

export default PumpingEquipmentList;
