import React from 'react';
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
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
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
  width: 80px;
  height: 80px;
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
  estado: 'pendiente'
};


const ServiceTc= () => {
  const {
    nombre,
    descripcion,
    fechaLimite,
    estado,
    imagen = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  } = tareaDemo;

  const [estadoVisita, setEstadoVisita] = React.useState(estado || 'pendiente');

  const handleEstadoChange = (e) => {
    setEstadoVisita(e.target.value);
  };

  return (
    <Container>
      <Header>
        <Imagen src={imagen} alt="icono" />
        <Titulo>{nombre}</Titulo>
        <Button variant="contained" color="error"
        style={{width:"16rem", flexShrink:0, marginTop:"1rem"}}>
          ELIMINAR
        </Button>
      </Header>

      <Divider />

      <Typography variant="subtitle1" sx={{color:"black"}}><strong>Informacion</strong></Typography>

      <Label>Nombre de la tarea:</Label>
      <Typography sx={{color:"black"}}> {nombre}</Typography>

      <Label>Descripcion:</Label>
      <Typography sx={{color:"black"}}>{descripcion}</Typography>

      <Label>Fecha limite:</Label>
      <Typography sx={{color:"black"}}>{fechaLimite}</Typography>

      <Label>Estado de la visita:</Label>
      <EstadoSelect value={estadoVisita} onChange={handleEstadoChange}>
        <MenuItem value="pendiente">pendiente</MenuItem>
        <MenuItem value="completado">completado</MenuItem>
        <MenuItem value="cancelado">cancelado</MenuItem>
      </EstadoSelect>

      <Botones>
        <Button variant="contained" color="primary">GENERAR REPORTE</Button>
        <Button variant="contained" color="primary">EDITAR REPORTE</Button>
      </Botones>
    </Container>
  );
};

export default ServiceTc;