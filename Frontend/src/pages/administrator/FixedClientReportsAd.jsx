import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Button,
  Card as MuiCard,
  CardContent,
  Typography,
  Alert
} from '@mui/material';
import { FileText, Zap, Droplet } from 'lucide-react';
import { handleGetListClient } from '../../controllers/common/getListClient.controller';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
  background-color: #1976d2;
  color: white;
  padding: 1.5rem 2rem;
  font-size: 20px;
  font-weight: bold;

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 16px;
  }
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #1565c0;
  font-size: 18px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ReportCard = styled(MuiCard)`
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
    border-color: #1976d2;
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  background: ${props => props.color || '#1976d2'};
  color: white;
`;

const InfoBox = styled.div`
  background-color: #e3f2fd;
  border-left: 4px solid #1976d2;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
`;

const FixedClientReportsAd = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [fixedClients, setFixedClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await handleGetListClient();
      setClients(response);
      
      // Filtrar solo clientes fijos
      const fixed = response.filter(client => client.tipo_cliente === 'fijo');
      setFixedClients(fixed);
      
      if (fixed.length === 0) {
        setError('No hay clientes fijos registrados. Crea un cliente fijo primero desde la sección de Gestión de Clientes.');
      }
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setError('Error al cargar la lista de clientes fijos');
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
  };

  const handleCreateReport = (reportType) => {
    if (!selectedClient) {
      alert('Por favor selecciona un cliente fijo primero');
      return;
    }

    // Navegar a la página de creación del reporte correspondiente
    const client = fixedClients.find(c => c.id === selectedClient);
    
    // Guardar cliente seleccionado en sessionStorage para acceso en los formularios
    sessionStorage.setItem('selectedFixedClient', JSON.stringify(client));
    
    switch(reportType) {
      case 'ficha':
        navigate(`/admin/reportes-clientes-fijos/ficha-mantenimiento/${client.id}`);
        break;
      case 'bombeo':
        navigate(`/admin/reportes-clientes-fijos/reporte-bombeo/${client.id}`);
        break;
      case 'planta':
        navigate(`/admin/reportes-clientes-fijos/reporte-planta/${client.id}`);
        break;
      default:
        break;
    }
  };

  const selectedClientData = fixedClients.find(c => c.id === selectedClient);

  return (
    <Container>
      <Header>
        REPORTES PARA CLIENTES FIJOS
      </Header>

      <Content>
        <Section>
          <SectionTitle>
            Seleccionar Cliente Fijo
          </SectionTitle>

          <InfoBox>
            <Typography variant="body2" color="primary">
              <strong>Nota:</strong> Los clientes fijos no requieren solicitudes ni visitas programadas. 
              Puedes crear reportes directamente y se enviarán por correo electrónico al cliente.
            </Typography>
          </InfoBox>

          {error && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Typography>Cargando clientes fijos...</Typography>
          ) : (
            <>
              <FormControl fullWidth disabled={fixedClients.length === 0}>
                <InputLabel>Seleccionar Cliente</InputLabel>
                <Select
                  value={selectedClient}
                  onChange={handleClientChange}
                  label="Seleccionar Cliente"
                >
                  <MenuItem value="">
                    <em>-- Seleccione un cliente --</em>
                  </MenuItem>
                  {fixedClients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.nombre} {client.apellido} - {client.numero_de_cedula}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedClientData && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <strong>Cliente seleccionado:</strong> {selectedClientData.nombre} {selectedClientData.apellido}
                  <br />
                  <strong>Correo:</strong> {selectedClientData.correo_electronico}
                  <br />
                  <strong>Teléfono:</strong> {selectedClientData.telefono}
                </Alert>
              )}
            </>
          )}
        </Section>

        {selectedClient && (
          <Section>
            <SectionTitle>
              Crear Reporte
            </SectionTitle>

            <ReportGrid>
              <ReportCard onClick={() => handleCreateReport('ficha')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconWrapper color="#43a047">
                    <FileText size={32} />
                  </IconWrapper>
                  <Typography variant="h6" gutterBottom>
                    Ficha de Mantenimiento
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Crear y enviar ficha de mantenimiento al cliente
                  </Typography>
                </CardContent>
              </ReportCard>

              <ReportCard onClick={() => handleCreateReport('bombeo')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconWrapper color="#1976d2">
                    <Droplet size={32} />
                  </IconWrapper>
                  <Typography variant="h6" gutterBottom>
                    Reporte de Bombeo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Crear y enviar reporte de equipos de bombeo
                  </Typography>
                </CardContent>
              </ReportCard>

              <ReportCard onClick={() => handleCreateReport('planta')}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <IconWrapper color="#f57c00">
                    <Zap size={32} />
                  </IconWrapper>
                  <Typography variant="h6" gutterBottom>
                    Reporte de Planta Eléctrica
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Crear y enviar reporte de mantenimiento de planta
                  </Typography>
                </CardContent>
              </ReportCard>
            </ReportGrid>
          </Section>
        )}
      </Content>
    </Container>
  );
};

export default FixedClientReportsAd;
