import React from 'react';
import styled from 'styled-components';
import { Checkbox, FormControlLabel, Typography, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

// Layout principal
const Layout = styled.div`
  display: flex;
  height: 100vh;
`;

// Fondo gris
const Background = styled.div`
  flex: 1;
  background-color: #ccc;
`;

// Panel lateral derecho
const Sidebar = styled.div`
  width: 300px;
  background-color: white;
  border-left: 1px solid #ccc;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  color:black;
`;

// Título de sección
const SectionTitle = styled(Typography)`
  margin: 16px 0 8px;
  font-weight: bold;
`;

// Encabezado de filtros
const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const FiltroPanel = () => {
  return (
    <Layout>
      <Background />
      <Sidebar>
        <FilterHeader>
          <FontAwesomeIcon icon={faFilter} />
          <Typography variant="h6">Filtros</Typography>
        </FilterHeader>

        <SectionTitle variant="subtitle1"><strong>Tipo de notificación</strong></SectionTitle>
        <FormControlLabel control={<Checkbox />} label="Alerta crítica" />
        <FormControlLabel control={<Checkbox />} label="Mantenimiento programado" />
        <FormControlLabel control={<Checkbox />} label="Mantenimiento correctivo" />
        <FormControlLabel control={<Checkbox />} label="Actualización de sistema" />
        <FormControlLabel control={<Checkbox />} label="Revisión técnica" />

        <Divider style={{ margin: '16px 0' }} />

        <SectionTitle variant="subtitle1"><strong>Componente afectado</strong></SectionTitle>
        <FormControlLabel control={<Checkbox />} label="Turbina" />
        <FormControlLabel control={<Checkbox />} label="Generador" />
        <FormControlLabel control={<Checkbox />} label="Válvulas" />
        <FormControlLabel control={<Checkbox />} label="Tuberías" />
        <FormControlLabel control={<Checkbox />} label="Sensor de nivel/presión" />

        <Divider style={{ margin: '16px 0' }} />

        <SectionTitle variant="subtitle1"><strong>Nivel de prioridad</strong></SectionTitle>
        <FormControlLabel control={<Checkbox />} label="Alta" />
        <FormControlLabel control={<Checkbox />} label="Media" />
        <FormControlLabel control={<Checkbox />} label="Baja" />
      </Sidebar>
    </Layout>
  );
};

export default FiltroPanel;