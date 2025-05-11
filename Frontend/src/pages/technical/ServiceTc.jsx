import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, MenuItem, Select, Typography } from '@mui/material';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Titulo = styled.h2`
  flex:1;
  text-align: center;
  margin:0;
  min-width:0;
  word-break:break-word;
  color:black;
`;

const Imagen = styled.img`
  width: 120px;
  height: 120px;
  flex-shrink:0;
`;

const Divider = styled.hr`
  margin: 2rem 0;
`;

const Label = styled.p`
  font-weight: bold;
  margin: 0.5rem 0 0.2rem;
  color:black;
`;

const EstadoSelect = styled(Select)`
  width: 200px;
  margin-bottom: 1rem;
`;

const Botones = styled.div`
  display: flex;
  gap: 1rem;
`;



const tareaDemo = {
  nombre: 'Revisión de válvulas de presión en planta sur',
  descripcion: `Realizar inspección preventiva y mantenimiento de las válvulas de presión ubicadas
  en la planta sur. Verificar estado de sellos, realizar limpieza, lubricación y
  reemplazo si es necesario. Documentar hallazgos y tomar fotografías del antes y después.`,
  fechaLimite: '25/04/2025',
  estado: 'programada',
  duracionEstimada: '15 minutos',
};


const ServiceTc= () => {
  const {
    nombre,
    descripcion,
    fechaLimite,
    estado,
    duracionEstimada,
    imagen = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  } = tareaDemo;

  const [estadoVisita, setEstadoVisita] = useState(estado || 'programada');

  const handleEstadoChange = (e) => {
    setEstadoVisita(e.target.value);
  };

  return (
    <Container>
      <Header>
        <Imagen src={imagen} alt="icono" />
        <Titulo>{nombre}</Titulo>
      </Header>

      <Divider />

      <Typography variant="subtitle1" sx={{color:"black"}}><strong>Informacion</strong></Typography>

      <Label>Notas previas:</Label>
      <Typography sx={{color:"black"}}> {nombre}</Typography>

      <Label>Notas posteriores:</Label>
      <Typography sx={{color:"black"}}>{descripcion}</Typography>

      <Label>Fecha programada:</Label>
      <Typography sx={{color:"black"}}>{fechaLimite}</Typography>

      <Label>Duracion estimada:</Label>
      <Typography sx={{color:"black"}}>{duracionEstimada}</Typography>

      <Label>Estado de la visita:</Label>
      <EstadoSelect value={estadoVisita} onChange={handleEstadoChange}>
        <MenuItem value="programada">Programada</MenuItem>
        <MenuItem value="en camino">En camino</MenuItem>
        <MenuItem value="iniciada">Iniciada</MenuItem>
        <MenuItem value="completada">Completada</MenuItem>
        <MenuItem value="cancelada">Cancelada</MenuItem>
      </EstadoSelect>

      <Botones>
        <Button variant="contained" color="primary">GENERAR REPORTE</Button>
        <Button variant="contained" color="primary">EDITAR REPORTE</Button>
      </Botones>
    </Container>
  );
};

export default ServiceTc;