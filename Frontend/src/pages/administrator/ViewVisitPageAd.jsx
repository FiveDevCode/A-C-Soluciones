import styled from 'styled-components';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  MenuItem,
  Select,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { handleGetPDFIdVisit } from '../../controllers/common/getPDFIdVisit.controller';
import { useEffect, useState } from 'react';
import { handleGetVisit } from '../../controllers/administrator/getVisitAd.controller';
import { handleGetService } from '../../controllers/administrator/getServiceAd.controller';
import { handleUpdateStateVisit } from '../../controllers/common/updateStateVisit.controller';
import { FaExclamationTriangle } from 'react-icons/fa';

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


const ViewVisitPageAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [visitData, setVisitData] = useState(null);
  const [stateVisit, setStateVisit] = useState('');
  const [pathName, setPathName] = useState(null)
  const [servicio, setServicio] = useState(null)
  const [pendingState, setPendingState] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  
  handleUpdateStateVisit

  useEffect(() => {
    if (id) {
      handleGetVisit(id)
        .then((res) => {
          const data = res.data.data;
          console.log(data)
          setVisitData(data);
          setStateVisit(data.estado || 'programada');
        })
        .catch((err) => {
          console.error('Error al obtener el servicio asignado:', err);
        });
    }
  }, [id]);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await handleGetPDFIdVisit(id);
        console.log(response.data)
        setPathName(response.data[0].pdf_path);
      } catch (err) {
        console.log('Error al obtener el PDF:', err);
      }
    };
    
    if (id) {
      fetchPDF();
    }
  }, [id]);
  
  
  const {
    fecha_programada,
    duracion_estimada,
    notas_previas,
    notas_posteriores,
    servicio_id_fk,
  } = visitData || {};
  
  useEffect(() => {
    const handleService = async () => {
      if (servicio_id_fk) {
        const service = await handleGetService(servicio_id_fk);
        console.log(service)
        setServicio(service.data.data);
      }
    };
    
    handleService();
  }, [servicio_id_fk]);
  
  if (!visitData) {
    return <Typography sx={{ color: 'black', textAlign: 'center' }}>Cargando datos del servicio...</Typography>;
  }
  
  const handleStateChange = (e) => {
    const selected = e.target.value;

    // Si es completada o cancelada, pedimos confirmación
    if (['completada', 'cancelada'].includes(selected)) {
      setPendingState(selected);
      setOpenConfirm(true);
    } else {
      updateState(selected);
    }
  };

  const updateState = async (newState) => {
    setStateVisit(newState);

    try {
      await handleUpdateStateVisit(id, newState);
      console.log('Estado actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      alert('No se pudo actualizar el estado. Verifica si la visita ya fue completada o cancelada.');
      setStateVisit(visitData.estado);
    }
  };

  const handleCreateReport = () => {
    navigate(`/admin/reporte/${id}`);
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
      <Typography sx={{ color: 'black', wordBreak: 'break-all'  }}>
        {notas_previas?.trim() ? notas_previas : 'No hay notas previas registradas'}
      </Typography>

      <Label>Notas posteriores:</Label>
      <Typography sx={{ color: 'black', wordBreak: 'break-all'  }}>
        {notas_posteriores?.trim() ? notas_posteriores : 'No hay notas posteriores registradas'}
      </Typography>

      <Label>Fecha programada:</Label>
      <Typography sx={{ color: 'black' }}>
        {fecha_programada ? fecha_programada.substring(0, 10) : 'No hay fecha programada'}
      </Typography>

      <Label>Duración estimada:</Label>
      <Typography sx={{ color: 'black' }}>
        {duracion_estimada ? `${duracion_estimada} minutos` : 'No se especificó duración'}
      </Typography>

      <Label>Estado de la visita:</Label>
      <EstadoSelect value={stateVisit} onChange={handleStateChange} disabled={['completada', 'cancelada'].includes(stateVisit)}>
        <MenuItem value="programada">Programada</MenuItem>
        <MenuItem value="en_camino">En camino</MenuItem>
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
        {pathName ? (
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: 'none', fontSize: "1rem", fontWeight: "600" }}
            onClick={async () => {
              try {
                const token = localStorage.getItem('authToken');

                const relativePath = pathName.replace(/^uploads[\\/]/, '').replace(/\\/g, '/');
                const publicUrl = `http://localhost:8000/${relativePath}`;
                const response = await fetch(publicUrl, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });

                if (!response.ok) {
                  throw new Error('No se pudo obtener el PDF');
                }

                const blob = await response.blob();
                const fileURL = URL.createObjectURL(blob);
                window.open(fileURL, '_blank');
              } catch (err) {
                console.error('Error al abrir el PDF protegido:', err);
              }
            }}
          >
            Ver reporte
          </Button>
        ):(
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', fontSize: "1rem", fontWeight: "600" }}
            onClick={handleCreateReport}
          >
            Generar reporte
          </Button>
        )}
        <Button variant="contained" color="primary" sx={{textTransform: 'none', fontSize: "1rem", fontWeight: "600"}}>Editar reporte</Button>
      </Botones>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FaExclamationTriangle color="#FFA726" size={20} />
          Confirmar cambio de estado
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas marcar esta visita como <strong>{pendingState}</strong>? Esta acción podría ser irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setOpenConfirm(false);
              updateState(pendingState);
              setPendingState(null);
            }}
            color="error"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default ViewVisitPageAd;
