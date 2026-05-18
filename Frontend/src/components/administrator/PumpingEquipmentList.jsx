import { TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from "@mui/material";
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
        sumergibles_medida: "",
        sumergibles_placa: "",
        amperaje_medida: "",
        amperaje_placa: "",
        amperaje_estado: "Normal",
        ruidos: "Normal",
        humedad: "No",
        conexiones: "Normal",
        presion: "",
        temperatura: ""
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
            label="Sumergibles - Medida"
            value={e.sumergibles_medida}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(ev) => update(i, "sumergibles_medida", ev.target.value)}
          />

          <TextField
            label="Sumergibles - Placa"
            value={e.sumergibles_placa}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(ev) => update(i, "sumergibles_placa", ev.target.value)}
          />

          <TextField
            label="Amperaje - Medida"
            value={e.amperaje_medida}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(ev) => update(i, "amperaje_medida", ev.target.value)}
          />

          <TextField
            label="Amperaje - Placa"
            value={e.amperaje_placa}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(ev) => update(i, "amperaje_placa", ev.target.value)}
          />

          <FormControl component="fieldset" sx={{ mb: 1, display: 'block' }}>
            <FormLabel component="legend" sx={{ fontSize: '0.85rem' }}>Estado Amperaje</FormLabel>
            <RadioGroup
              row
              value={e.amperaje_estado}
              onChange={(ev) => update(i, "amperaje_estado", ev.target.value)}
            >
              <FormControlLabel value="Normal" control={<Radio size="small" />} label="Normal" />
              <FormControlLabel value="Recalentada" control={<Radio size="small" />} label="Recalentada" />
            </RadioGroup>
          </FormControl>

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

          <FormControl component="fieldset" sx={{ mb: 1, display: 'block' }}>
            <FormLabel component="legend" sx={{ fontSize: '0.85rem' }}>Ruidos</FormLabel>
            <RadioGroup
              row
              value={e.ruidos}
              onChange={(ev) => update(i, "ruidos", ev.target.value)}
            >
              <FormControlLabel value="Normal" control={<Radio size="small" />} label="Normal" />
              <FormControlLabel value="Fallas" control={<Radio size="small" />} label="Fallas" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mb: 1, display: 'block' }}>
            <FormLabel component="legend" sx={{ fontSize: '0.85rem' }}>Humedad</FormLabel>
            <RadioGroup
              row
              value={e.humedad}
              onChange={(ev) => update(i, "humedad", ev.target.value)}
            >
              <FormControlLabel value="Si" control={<Radio size="small" />} label="Si" />
              <FormControlLabel value="No" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mb: 1, display: 'block' }}>
            <FormLabel component="legend" sx={{ fontSize: '0.85rem' }}>Conexiones Eléctricas</FormLabel>
            <RadioGroup
              row
              value={e.conexiones}
              onChange={(ev) => update(i, "conexiones", ev.target.value)}
            >
              <FormControlLabel value="Normal" control={<Radio size="small" />} label="Normal" />
              <FormControlLabel value="Fallas" control={<Radio size="small" />} label="Fallas" />
            </RadioGroup>
          </FormControl>

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
