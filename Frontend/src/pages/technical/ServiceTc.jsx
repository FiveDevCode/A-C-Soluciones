import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Accordion, AccordionSummary, AccordionDetails, Button, MenuItem, Select, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { handleGetServiceAssign } from '../../controllers/technical/getServiceAssignTc.controller';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const Container = styled.div`
  padding-top: 0.5rem;
  padding-left: 2rem;
  padding-bottom: 0;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Titulo = styled.h2`
  flex:1;
  text-align: start;
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
  margin-top: 1rem;
`;


const ServiceTc = () => {
  const { id } = useParams();
  const [servicioData, setServicioData] = useState(null);
  const [estadoVisita, setEstadoVisita] = useState('');

  useEffect(() => {
    if (id) {
      handleGetServiceAssign(id)
        .then((res) => {
          const data = res.data.data;
          setServicioData(data);
          setEstadoVisita(data.estado || 'programada');
        })
        .catch((err) => {
          console.error('Error al obtener el servicio asignado:', err);
        });
    }
  }, [id]);

  if (!servicioData) {
    return <Typography sx={{ color: 'black', textAlign: 'center' }}>Cargando datos del servicio...</Typography>;
  }

  const {
    fecha_programada,
    duracion_estimada,
    notas_previas,
    notas_posteriores,
    servicio,
  } = servicioData;

  const handleEstadoChange = (e) => {
    setEstadoVisita(e.target.value);
  };

  return (
    <Container>
      <Header>
        <Imagen src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="icono" />
        <Titulo>{servicio?.nombre || 'Sin nombre'}</Titulo>
      </Header>

      <Divider />

      <Typography variant="subtitle1" sx={{ color: 'black' }}><strong>Información</strong></Typography>

      <Label>Notas previas:</Label>
      <Typography sx={{ color: 'black' }}>{notas_previas}</Typography>

      <Label>Notas posteriores:</Label>
      <Typography sx={{ color: 'black' }}>{notas_posteriores}</Typography>

      <Label>Fecha programada:</Label>
      <Typography sx={{ color: 'black' }}>{fecha_programada?.substring(0, 10)}</Typography>

      <Label>Duración estimada:</Label>
      <Typography sx={{ color: 'black' }}>{duracion_estimada} minutos</Typography>

      <Label>Estado de la visita:</Label>
      <EstadoSelect value={estadoVisita} onChange={handleEstadoChange}>
        <MenuItem value="programada">Programada</MenuItem>
        <MenuItem value="en camino">En camino</MenuItem>
        <MenuItem value="iniciada">Iniciada</MenuItem>
        <MenuItem value="completada">Completada</MenuItem>
        <MenuItem value="cancelada">Cancelada</MenuItem>
      </EstadoSelect>

      <Accordion
        sx={{
          backgroundColor: '#5D4037',
          border: '1px solid #bdbdbd',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '2px',
          borderBottom: '1px solid #3E2723',
          mt: 1
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: '#3CAEA3',
            padding: '6px 12px',
            borderBottom: '1px solid #2a9d8f',
          }}
      
        >
        <Typography sx={{ fontWeight: 'bold', color: '#EFEBE9' }}>
          Servicio asignado: {servicio?.nombre}
        </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: '16px', color: '#424242', backgroundColor: '#FBF8F6', borderLeft: '4px solid #8D6E63' }}>
          <Typography>
            <strong>Descripción:</strong> {servicio?.descripcion}
          </Typography>
          <Typography>
            <strong>Estado:</strong> {servicio?.estado}
          </Typography>
          <Typography>
            <strong>Fecha de creación:</strong> {new Date(servicio?.fecha_creacion).toLocaleDateString()}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Botones>
        <Button variant="contained" color="primary" sx={{ textTransform: 'none', fontSize: "1rem", fontWeight: "600" }}>Generar reporte</Button>
        <Button variant="contained" color="primary" sx={{ textTransform: 'none', fontSize: "1rem", fontWeight: "600" }}>Editar reporte</Button>
      </Botones>
    </Container>
  );
};

export default ServiceTc;
