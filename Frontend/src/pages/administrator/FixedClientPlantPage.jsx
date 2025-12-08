import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Alert } from '@mui/material';
import styled from 'styled-components';
import { handleGetClient } from '../../controllers/administrator/getClientAd.controller';

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
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el cliente');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [clientId, navigate]);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <Alert severity="error">{error}</Alert>
      </LoadingContainer>
    );
  }

  return (
    <LoadingContainer>
      <MessageBox>
        <h2>Reporte de Mantenimiento de Planta Eléctrica para Cliente Fijo</h2>
        <Alert severity="info" sx={{ mt: 2 }}>
          Cliente: {clientData?.nombre} {clientData?.apellido}
          <br />
          <br />
          <strong>Formulario en construcción</strong>
          <br />
          Este formulario permitirá crear reportes de mantenimiento de plantas eléctricas directamente para clientes fijos sin necesidad de visita programada.
        </Alert>
      </MessageBox>
    </LoadingContainer>
  );
};

export default FixedClientPlantPage;
