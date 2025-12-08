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
import { handleGetVisitAssign } from '../../controllers/technical/getVisitAssignTc.controller';
import { FaExclamationTriangle } from 'react-icons/fa';
import { handleUpdateStateVisit } from '../../controllers/common/updateStateVisit.controller';
import { useMenu } from '../../components/technical/MenuContext';


const API_KEY = import.meta.env.VITE_API_URL || 'http://localhost:8000';


const PageContainer = styled.div`
  padding: 1.5rem 2rem;
  min-height: calc(100vh);
  transition: margin-left 0.3s ease;
  background-color: #f5f7fa;

  @media screen and (max-width: 1520px) {
    padding: 1.5rem 1.5rem;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderCard = styled.div`
  background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
`;

const ServiceIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(10px);

  img {
    width: 55px;
    height: 55px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;

    img {
      width: 50px;
      height: 50px;
    }
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ServiceTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  word-break: break-word;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ServiceSubtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
`;

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ColumnCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ColumnTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a237e;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e3f2fd;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled(Typography)`
  color: #1e293b !important;
  font-size: 0.95rem !important;
  word-break: break-word;
  line-height: 1.5;
`;

const NotesBox = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.75rem;
  border-left: 4px solid #007BFF;
  min-height: 120px;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;

    &:hover {
      background: #94a3b8;
    }
  }
`;

const NotesText = styled(Typography)`
  color: #334155 !important;
  font-size: 0.9rem !important;
  line-height: 1.6 !important;
  white-space: pre-wrap;
  word-break: break-word;
`;

const EstadoSelect = styled(Select)`
  width: 100%;
  margin-top: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
`;

const ActionButton = styled(Button)`
  && {
    text-transform: none;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.6rem 0.75rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }
`;


const ViewVisitPageTc = () => {
  const { collapsed } = useMenu();
  const { id } = useParams();
  const [visitData, setVisitData] = useState(null);
  const [stateVisit, setStateVisit] = useState('');
  const [pathName, setPathName] = useState(null)
  const [pendingState, setPendingState] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      handleGetVisitAssign(id)
        .then((res) => {
          const data = res.data.data;
          setVisitData(data);
          setStateVisit(data.estado || 'programada');
        })
        .catch((err) => {
          console.error('Error al obtener el visit asignado:', err);
        });
    }
  }, [id]);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await handleGetPDFIdVisit(id);
        // Verificar que haya fichas y que la primera tenga pdf_path
        if (response.data && response.data.length > 0 && response.data[0].pdf_path) {
          setPathName(response.data[0].pdf_path);
        } else {
          setPathName(null);
        }
      } catch (err) {
        console.log('Error al obtener el PDF:', err);
        setPathName(null);
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
    servicio,
  } = visitData || {};
  
  
  
  if (!visitData) {
    return <Typography sx={{ color: 'black', textAlign: 'center' }}>Cargando datos del visit...</Typography>;
  }

  const handleStateChange = (e) => {
    const selected = e.target.value;

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
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      alert('No se pudo actualizar el estado. Verifica si la visita ya fue completada o cancelada.');
      setStateVisit(visitData.estado);
    }
  };  

  const handleCreateReport = () => {
    navigate(`/tecnico/reporte/${id}`);
  };


  return (
    <PageContainer $collapsed={collapsed}>
      <Container>
        {/* Header con información del servicio */}
        <HeaderCard>
          <ServiceIcon>
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Servicio" />
          </ServiceIcon>
          <HeaderInfo>
            <ServiceTitle>{servicio?.nombre || 'Sin nombre'}</ServiceTitle>
            <ServiceSubtitle>Detalles de la visita asignada</ServiceSubtitle>
          </HeaderInfo>
        </HeaderCard>

        {/* Grid de 3 columnas */}
        <ThreeColumnGrid>
          {/* Columna 1: Información General */}
          <ColumnCard>
            <ColumnTitle>Información General</ColumnTitle>
            
            <InfoItem>
              <InfoLabel>Fecha Programada</InfoLabel>
              <InfoValue>
                {fecha_programada 
                  ? new Date(fecha_programada).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'No hay fecha programada'}
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Duración Estimada</InfoLabel>
              <InfoValue>
                {duracion_estimada ? `${duracion_estimada} minutos` : 'No se especificó duración'}
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Estado de la Visita</InfoLabel>
              <EstadoSelect 
                value={stateVisit} 
                onChange={handleStateChange} 
                disabled={['completada', 'cancelada'].includes(stateVisit)}
                size="small"
              >
                <MenuItem value="programada">Programada</MenuItem>
                <MenuItem value="en_camino">En camino</MenuItem>
                <MenuItem value="iniciada">Iniciada</MenuItem>
                <MenuItem value="completada">Completada</MenuItem>
                <MenuItem value="cancelada">Cancelada</MenuItem>
              </EstadoSelect>
            </InfoItem>
          </ColumnCard>

          {/* Columna 2: Notas */}
          <ColumnCard>
            <ColumnTitle>Notas</ColumnTitle>
            
            <InfoItem>
              <InfoLabel>Notas Previas</InfoLabel>
              <NotesBox>
                <NotesText>
                  {notas_previas?.trim() 
                    ? notas_previas 
                    : 'No hay notas previas registradas'}
                </NotesText>
              </NotesBox>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Notas Posteriores</InfoLabel>
              <NotesBox>
                <NotesText>
                  {notas_posteriores?.trim() 
                    ? notas_posteriores 
                    : 'No hay notas posteriores registradas'}
                </NotesText>
              </NotesBox>
            </InfoItem>
          </ColumnCard>

          {/* Columna 3: Servicio y Acciones */}
          <ColumnCard>
            <ColumnTitle>Servicio y Acciones</ColumnTitle>
            
            <Accordion
              sx={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                boxShadow: 'none',
                borderRadius: '8px',
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#007BFF',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '0.5rem 0.75rem',
                  '&:hover': {
                    backgroundColor: '#0056b3',
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                  },
                }}
              >
                <Typography sx={{ fontWeight: '600', fontSize: '0.95rem' }}>
                  Servicio: {servicio?.nombre}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: '1rem', backgroundColor: '#ffffff' }}>
                <InfoItem>
                  <InfoLabel>Descripción</InfoLabel>
                  <InfoValue>{servicio?.descripcion || 'Sin descripción'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Estado del Servicio</InfoLabel>
                  <InfoValue>{servicio?.estado || 'N/A'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Fecha de Creación</InfoLabel>
                  <InfoValue>
                    {servicio?.fecha_creacion 
                      ? new Date(servicio.fecha_creacion).toLocaleDateString('es-ES')
                      : 'N/A'}
                  </InfoValue>
                </InfoItem>
              </AccordionDetails>
            </Accordion>

            <ActionButtons>
              {pathName ? (
                <ActionButton
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('authToken');
                      const fileName = pathName.split(/[/\\]/).pop();
                      const pdfUrl = `${API_KEY}/descargar/${fileName}`;
                      
                      const response = await fetch(pdfUrl, {
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
                      console.error('Error al abrir el PDF:', err);
                      alert('Error al abrir el PDF. Por favor, inténtalo de nuevo.');
                    }
                  }}
                >
                  Ver Reporte
                </ActionButton>
              ) : (
                <ActionButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCreateReport}
                >
                  Generar Reporte
                </ActionButton>
              )}
              <ActionButton 
                variant="outlined" 
                color="primary" 
                fullWidth
              >
                Editar Reporte
              </ActionButton>
            </ActionButtons>
          </ColumnCard>
        </ThreeColumnGrid>

        {/* Dialog de confirmación */}
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
    </PageContainer>
  );
};

export default ViewVisitPageTc;
