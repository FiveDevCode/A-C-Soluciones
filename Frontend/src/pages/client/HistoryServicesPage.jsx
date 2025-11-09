import styled from "styled-components";
import { Typography } from "@mui/material";
import { handleGetHistoryServiceByCliente } from "../../controllers/client/getHistoryServiceByCliente.controller";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import MenuSideCl from "../../components/client/MenuSideCl";
import HeaderBarCl from "../../components/client/HeaderBarCl";
import { useMenu } from "../../components/client/MenuContext";

const PageContainer = styled.div`
  background-color: #f9fafb;
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  margin-top: 80px;
  transition: margin-left 0.3s ease;
  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
`;

const ContainerHistoryServices = styled.section`
  width: 100%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  padding: 2rem 4rem;

  @media screen and (max-width: 1520px) {
    padding: 2rem 2rem;
  }

  @media screen and (max-width: 1280px) {
    padding: 1.5rem 1rem;
  }
`;

const Container = styled.div`
  width: 1300px;
  margin: 0 auto;
  padding: 2rem;
`;

const TitleContainer = styled.div`
  margin-bottom: 2rem;
`;

const MainContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  overflow-x: auto;
  background-color: #fff;
  border-radius: 0px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const TableServices = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fff;

  th,
  td {
    padding: 12px 20px;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;

    @media screen and (max-width: 1280px) {
      padding: 10px 12px;
      font-size: 0.85rem;
    }
  }

  th {
    background: linear-gradient(135deg, #91cdffff 0%, #91cdffff 100%);
    color: #000;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #60a5fa;
  }

  th:first-child {
    border-top-left-radius: 0px;
  }

  th:last-child {
    border-top-right-radius: 0px;
  }

  tbody tr {
    background-color: #fff;
    transition: all 0.2s ease;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:last-child td:first-child {
    border-bottom-left-radius: 0px;
  }

  tbody tr:last-child td:last-child {
    border-bottom-right-radius: 0px;
  }

  tbody tr:hover {
    background-color: #f9fafb;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  td {
    color: #374151;
    font-size: 0.9375rem;
  }
`;

const ActionButton = styled.button`
  background-color: #17A2B8;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: #138496;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(23, 162, 184, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media screen and (max-width: 1280px) {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.8125rem;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.$status?.toLowerCase()) {
      case 'completado':
      case 'completada':
        return '#dcfce7';
      case 'en proceso':
      case 'iniciada':
        return '#fef3c7';
      case 'pendiente':
        return '#fee2e2';
      case 'cancelado':
      case 'cancelada':
        return '#f3f4f6';
      case 'programada':
        return '#dbeafe';
      default:
        return '#e5e7eb';
    }
  }};
  color: ${(props) => {
    switch (props.$status?.toLowerCase()) {
      case 'completado':
      case 'completada':
        return '#166534';
      case 'en proceso':
      case 'iniciada':
        return '#854d0e';
      case 'pendiente':
        return '#991b1b';
      case 'cancelado':
      case 'cancelada':
        return '#4b5563';
      case 'programada':
        return '#1e40af';
      default:
        return '#374151';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
  font-size: 1rem;
  background-color: #fff;
`;

const HistoryServicesPage = () => {
  const { collapsed } = useMenu();
  const [historyServices, setHistoryServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryServices = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);
      const clienteId = decoded.id;

      try {
        const response = await handleGetHistoryServiceByCliente(clienteId);
        setHistoryServices(response.data.data);
      } catch (error) {
        console.error("Error al obtener el historial de servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryServices();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <>
      <MenuSideCl />
      <HeaderBarCl />
      <PageContainer $collapsed={collapsed}>
        <ContainerHistoryServices>
         <Container>
          <TitleContainer>
            <Typography
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "20px", md: "24px" },
                color: "#1a237e",
                marginBottom: "0.5rem",
              }}
            >
              Historial de Servicios
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: "#6b7280",
              }}
            >
              Visualiza todos tus servicios realizados
            </Typography>
          </TitleContainer>

          <MainContent>
            <TableContainer>
              <TableServices>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Servicio</th>
                    <th>Técnico</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5">
                        <EmptyState>Cargando servicios...</EmptyState>
                      </td>
                    </tr>
                  ) : historyServices.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <EmptyState>
                          No hay servicios en el historial.
                        </EmptyState>
                      </td>
                    </tr>
                  ) : (
                    historyServices.map((service, index) => (
                      <tr key={service.id || index}>
                        <td>{formatDate(service.fecha)}</td>
                        <td>{service.servicio || 'N/A'}</td>
                        <td>{service.tecnico || 'No asignado'}</td>
                        <td>
                          <StatusBadge $status={service.estado}>
                            {service.estado || 'Pendiente'}
                          </StatusBadge>
                        </td>
                        <td>
                          <ActionButton
                            onClick={() => {
                              console.log('Ver ficha:', service.id);
                            }}
                          >
                            Ver Ficha
                          </ActionButton>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </TableServices>
            </TableContainer>
          </MainContent>
         </Container>
        </ContainerHistoryServices>
      </PageContainer>
    </>
  );
};

export default HistoryServicesPage;