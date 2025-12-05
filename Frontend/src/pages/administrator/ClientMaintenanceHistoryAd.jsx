import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CircularProgress, Alert, Chip } from '@mui/material';
import { ArrowLeft, Download, Eye } from 'lucide-react';
import { handleGetClient } from '../../controllers/administrator/getClientAd.controller';
import BaseTable from '../../components/common/BaseTable';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: #1976d2;
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #333;
  font-weight: 600;
`;

const TableCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #1565c0;
  font-size: 18px;
  margin: 0 0 1.5rem 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ClientMaintenanceHistoryAd = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Obtener datos del cliente
      const response = await handleGetClient(clientId);
      const client = response.data;
      setClientData(client);

      // Obtener fichas del cliente
      const token = localStorage.getItem('authToken');
      const fichasUrl = `${API_URL}/obtener-por-cliente/${clientId}`;
      console.log('Fetching fichas from:', fichasUrl);
      
      const fichasResponse = await fetch(fichasUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', fichasResponse.status);
      
      if (!fichasResponse.ok) {
        const errorText = await fichasResponse.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al cargar fichas: ${fichasResponse.status}`);
      }

      const fichasData = await fichasResponse.json();
      console.log('Fichas data:', fichasData);
      setFichas(Array.isArray(fichasData.fichas) ? fichasData.fichas : []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(`Error al cargar el historial de fichas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (pdf_path) => {
    if (!pdf_path) {
      alert('No hay PDF disponible para esta ficha');
      return;
    }
    
    try {
      // Extraer solo el nombre del archivo
      const fileName = pdf_path.split(/[/\\]/).pop();
      const pdfUrl = `${API_URL}/descargar/${fileName}`;
      
      const token = localStorage.getItem('authToken');
      const response = await fetch(pdfUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al descargar el PDF');
      }
      
      // Convertir la respuesta a blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Error al descargar el PDF');
    }
  };

  const columns = [
    { 
      header: "Fecha", 
      accessor: "fecha_de_mantenimiento",
      render: (value) => new Date(value).toLocaleDateString('es-CO')
    },
    { header: "Introducción", accessor: "introduccion" },
    { 
      header: "Tiempo de Trabajo", 
      accessor: "tiempo_de_trabajo" 
    },
    {
      header: "Visita",
      accessor: "id_visitas",
      render: (value) => value ? `#${value}` : <Chip label="Cliente Fijo" size="small" color="success" />
    },
    {
      header: "PDF",
      accessor: "pdf_path",
      render: (value, row) => (
        <button
          onClick={() => handleDownloadPDF(value)}
          disabled={!value}
          style={{
            background: value ? '#1976d2' : '#ccc',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: value ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Download size={16} />
          Descargar
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderTitle>HISTORIAL DE FICHAS DE MANTENIMIENTO</HeaderTitle>
        </Header>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/admin/clientes')}>
            <ArrowLeft size={20} />
            Volver
          </BackButton>
          <HeaderTitle>ERROR</HeaderTitle>
        </Header>
        <Content>
          <Alert severity="error">{error}</Alert>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/admin/clientes')}>
          <ArrowLeft size={20} />
          Volver
        </BackButton>
        <HeaderTitle>HISTORIAL DE FICHAS DE MANTENIMIENTO</HeaderTitle>
      </Header>

      <Content>
        <InfoCard>
          <SectionTitle>Información del Cliente</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Nombre Completo</InfoLabel>
              <InfoValue>{clientData?.nombre} {clientData?.apellido}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Cédula</InfoLabel>
              <InfoValue>{clientData?.numero_de_cedula}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Tipo de Cliente</InfoLabel>
              <InfoValue>
                {clientData?.tipo_cliente === 'fijo' ? (
                  <Chip label="Cliente Fijo" color="success" size="small" />
                ) : (
                  <Chip label="Cliente Regular" color="primary" size="small" />
                )}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Correo Electrónico</InfoLabel>
              <InfoValue>{clientData?.correo_electronico}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Teléfono</InfoLabel>
              <InfoValue>{clientData?.telefono}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Total de Fichas</InfoLabel>
              <InfoValue>{fichas.length}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </InfoCard>

        <TableCard>
          <SectionTitle>Fichas de Mantenimiento</SectionTitle>
          {fichas.length === 0 ? (
            <Alert severity="info">
              Este cliente no tiene fichas de mantenimiento registradas aún.
            </Alert>
          ) : (
            <BaseTable
              data={fichas}
              columns={columns}
              emptyMessage="No hay fichas de mantenimiento registradas"
              mobileConfig={{
                title: "fecha_de_mantenimiento",
                subtitle: "introduccion"
              }}
            />
          )}
        </TableCard>
      </Content>
    </Container>
  );
};

export default ClientMaintenanceHistoryAd;
