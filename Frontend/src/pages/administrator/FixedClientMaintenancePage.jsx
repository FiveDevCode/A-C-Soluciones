import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { CircularProgress, Alert } from '@mui/material';
import styled from 'styled-components';
import FixedClientMaintenanceForm from '../../components/administrator/FixedClientMaintenanceForm';
import { handleGetClient } from '../../controllers/administrator/getClientAd.controller';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
`;

const FixedClientMaintenancePage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [technicianId, setTechnicianId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Para clientes fijos creados por admin, no se requiere técnico
        // El id_tecnico puede ser null
        setTechnicianId(null);

        // Obtener datos del cliente
        const response = await handleGetClient(clientId);
        const client = response.data;
        
        // Verificar que sea cliente fijo
        if (client.tipo_cliente !== 'fijo') {
          setError('Este cliente no es de tipo fijo. Solo se pueden crear reportes directos para clientes fijos.');
          setTimeout(() => navigate('/admin/reportes-clientes-fijos'), 3000);
          return;
        }

        setClientData(client);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar la información del cliente');
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
    <FixedClientMaintenanceForm
      clientId={parseInt(clientId)}
      clientData={clientData}
      technicianId={technicianId}
    />
  );
};

export default FixedClientMaintenancePage;
