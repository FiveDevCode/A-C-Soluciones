import styled from 'styled-components';
import { Accordion, AccordionSummary, AccordionDetails, Button, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { handleGetRequest } from '../../controllers/common/getRequest.controller';
import { handleUpdateStateVisit } from '../../controllers/common/updateStateVisit.controller';
import { handleUpdateStateRequest } from '../../controllers/administrator/UpdateStateRequestAd.controller';


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

// const Botones = styled.div`
//   display: flex;
//   gap: 1rem;
//   margin-top: 1rem;
// `;


const ViewRequestPageAd = () => {
  const { id } = useParams();
  const [requestData, setRequestData] = useState(null);
  const [stateRequest, setStateRequest] = useState('');

  useEffect(() => {
    if (id) {
      handleGetRequest(id)
        .then((res) => {
          const data = res.data;
          setRequestData(data);
          setStateRequest(data.estado || 'pendiente');
        })
        .catch((err) => {
          console.error('Error al obtener la solicitud del cliente', err);
        });
    }
  }, [id]);


  if (!requestData) {
    return <Typography sx={{ color: 'black', textAlign: 'center' }}>Cargando datos del servicio...</Typography>;
  }
  
  const {
    fecha_solicitud,
    direccion_servicio,
    descripcion,
    comentarios,
    servicio
  } = requestData;
  
  
  const handleStateChange = async(e) => {
    const newState = e.target.value;
    setStateRequest(newState); 



    try {
      await handleUpdateStateRequest(id, newState); // Llama al backend
    } catch (error) {
      console.error('Error al actualizar el estado de la visita:', error);
    }
  };


  return (
    <Container>
      <Header>
        <Imagen src="https://cdn-icons-png.flaticon.com/512/8392/8392178.png" alt="icono" />
        <Titulo>{servicio?.nombre || 'Sin nombre'}</Titulo>
      </Header>

      <Divider />

      <Typography variant="subtitle1" sx={{ color: 'black' }}><strong>Información</strong></Typography>

      <Label>Descripcion:</Label>
      <Typography sx={{ color: 'black' }}>
        {descripcion?.trim() ? descripcion : 'No hay descripcion'}
      </Typography>

      <Label>Comentarios:</Label>
      <Typography sx={{ color: 'black' }}>
        {comentarios?.trim() ? comentarios : 'No hay comentarios'}
      </Typography>

      <Label>Fecha de la solicitud:</Label>
      <Typography sx={{ color: 'black' }}>
        {fecha_solicitud ? fecha_solicitud.substring(0, 10) : 'No hay fecha programada'}
      </Typography>

      <Label>Dirrecion del cliente:</Label>
      <Typography sx={{ color: 'black' }}>
        {direccion_servicio ? `${direccion_servicio}` : 'No se especificó direccion'}
      </Typography>

      <Label>Estado de la solicitud:</Label>
      <EstadoSelect value={stateRequest} onChange={handleStateChange}>
        <MenuItem value="pendiente">Pendiente</MenuItem>
        <MenuItem value="cotizada">Cotizada</MenuItem>
        <MenuItem value="aceptada">Aceptada</MenuItem>
        <MenuItem value="en_proceso">En proceso</MenuItem>
        <MenuItem value="completada">Completada</MenuItem>
        <MenuItem value="anulada">Cancelada</MenuItem>
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
        </AccordionDetails>
      </Accordion>

    </Container>
  );
};

export default ViewRequestPageAd;
