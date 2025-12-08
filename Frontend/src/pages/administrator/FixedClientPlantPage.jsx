import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';
import styled from 'styled-components';
import { handleGetClient } from '../../controllers/administrator/getClientAd.controller';
import { handleGetListTechnical } from '../../controllers/administrator/getTechnicalListAd.controller';
import FixedClientPlantForm from '../../components/administrator/FixedClientPlantForm';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 2rem;
`;

const MessageBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  text-align: center;
`;

const FixedClientPlantPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [technicals, setTechnicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await handleGetClient(clientId);
        const client = response.data;
        
        if (client.tipo_cliente !== 'fijo') {
          setError('Este cliente no es de tipo fijo.');
          setTimeout(() => navigate('/admin/reportes-clientes-fijos'), 3000);
          return;
        }

        setClientData(client);

        // Cargar técnicos
        const techResponse = await handleGetListTechnical();
        setTechnicals(techResponse.data || []);
        
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId, navigate]);

  const handleBack = () => {
    navigate('/admin/reportes-clientes-fijos');
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress size={60} />
        <MessageBox>
          <h2>Cargando información del cliente...</h2>
        </MessageBox>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <MessageBox>
          <Alert severity="error">{error}</Alert>
        </MessageBox>
      </LoadingContainer>
    );
  }

  return (
    <FixedClientPlantForm
      clientData={clientData}
      technicals={technicals}
      onBack={handleBack}
    />
  );
};

export default FixedClientPlantPage;
