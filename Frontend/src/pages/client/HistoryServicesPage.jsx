import styled from "styled-components";
import { Typography } from "@mui/material";
import { handleGetHistoryServiceByCliente } from "../../controllers/client/getHistoryServiceByCliente.controller";
import { handleGetPDFIdVisit } from "../../controllers/common/getPDFIdVisit.controller";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import MenuSideCl from "../../components/client/MenuSideCl";
import { useMenu } from "../../components/client/MenuContext";
import Toast from "../../components/common/Toast";

const API_KEY = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PageContainer = styled.div`
  background-color: #f9fafb;
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  margin-top: 0;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
`;

const WelcomeSection = styled.header`
  background-color: #007BFF;
  color: white;
  padding: 2rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 1350px) {
    padding: 1.2rem;
    font-size: 18px;
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
    font-size: 16px;
  }
`;

const ContainerHistoryServices = styled.section`
  width: 100%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  padding: 2rem 4rem;
  padding-top: 2.5rem;

  @media screen and (max-width: 1520px) {
    padding: 2rem 2rem;
    padding-top: 2rem;
  }

  @media screen and (max-width: 1280px) {
    padding: 1.5rem 1rem;
    padding-top: 1.5rem;
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
  background-color: ${(props) => props.$variant === 'disabled' ? '#94a3b8' : '#007BFF'};
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: ${(props) => props.$variant === 'disabled' ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: ${(props) => props.$variant === 'disabled' ? 0.7 : 1};

  &:hover {
    background-color: ${(props) => props.$variant === 'disabled' ? '#94a3b8' : '#0056b3'};
    transform: ${(props) => props.$variant === 'disabled' ? 'none' : 'translateY(-2px)'};
    box-shadow: ${(props) => props.$variant === 'disabled' ? 'none' : '0 4px 8px rgba(0, 123, 255, 0.3)'};
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
      case 'iniciado':
        return '#fef3c7';
      case 'pendiente':
        return '#fee2e2';
      case 'cancelado':
      case 'cancelada':
        return '#f3f4f6';
      case 'programada':
        return '#dbeafe';
      case 'en_camino':
      case 'en camino':
        return '#e0e7ff';
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
      case 'iniciado':
        return '#854d0e';
      case 'pendiente':
        return '#991b1b';
      case 'cancelado':
      case 'cancelada':
        return '#4b5563';
      case 'programada':
        return '#1e40af';
      case 'en_camino':
      case 'en camino':
        return '#3730a3';
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
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

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

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const handleViewReport = async (visitaId, estado, pdfPath) => {
    const estadoLower = estado?.toLowerCase();
    const isCompleted = estadoLower === 'completada' || estadoLower === 'completado';
    
    // Si no está completada, mostrar mensaje
    if (!isCompleted) {
      showToast('La ficha de mantenimiento estará disponible una vez que el servicio sea completado.', 'info');
      return;
    }

    // Si está completada pero no hay PDF, intentar obtenerlo
    let finalPdfPath = pdfPath;
    
    if (!finalPdfPath && visitaId) {
      try {
        const response = await handleGetPDFIdVisit(visitaId);
        if (response.data && response.data[0] && response.data[0].pdf_path) {
          finalPdfPath = response.data[0].pdf_path;
        }
      } catch (error) {
        console.error('Error al obtener PDF:', error);
      }
    }

    // Si aún no hay PDF, mostrar mensaje
    if (!finalPdfPath) {
      showToast('La ficha de mantenimiento aún no está disponible. Por favor, contacte al administrador.', 'warning');
      return;
    }

    // Abrir el PDF usando el mismo método que el admin
    try {
      // Si es una URL de Cloudinary, abrirla directamente
      if (finalPdfPath.includes('cloudinary.com')) {
        window.open(finalPdfPath, "_blank");
        return;
      }

      const token = localStorage.getItem("authToken");
      
      // Extraer solo el nombre del archivo del path
      const fileName = finalPdfPath.split(/[/\\]/).pop();
      
      // Usar la ruta de descarga del backend (igual que el admin)
      const pdfUrl = `${API_KEY}/api/descargar/${fileName}`;
      
      const response = await fetch(pdfUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener el PDF");
      }

      // Convertir la respuesta a blob y abrir en nueva pestaña
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (err) {
      console.error("Error al abrir PDF:", err);
      showToast('No se pudo abrir la ficha. Por favor, intente más tarde.', 'error');
    }
  };

  return (
    <>
      <MenuSideCl />
      <PageContainer $collapsed={collapsed}>
        <WelcomeSection>
          HISTORIAL
        </WelcomeSection>
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
                    historyServices.map((service, index) => {
                      const estadoLower = service.estado?.toLowerCase();
                      const isCompleted = estadoLower === 'completada' || estadoLower === 'completado';
                      const hasPdf = !!service.pdf_path;
                      const visitaId = service.visita_id;

                      return (
                        <tr key={service.visita_id || index}>
                          <td>{formatDate(service.fecha)}</td>
                          <td>{service.servicio || 'N/A'}</td>
                          <td>{service.tecnico || 'No asignado'}</td>
                          <td>
                            <StatusBadge $status={service.estado}>
                              {service.estado === 'en_camino' ? 'En camino' : 
                               service.estado === 'programada' ? 'Programada' :
                               service.estado || 'Pendiente'}
                            </StatusBadge>
                          </td>
                          <td>
                            {isCompleted ? (
                              <ActionButton
                                onClick={() => handleViewReport(visitaId, service.estado, service.pdf_path)}
                              >
                                Ver Ficha
                              </ActionButton>
                            ) : (
                              <ActionButton
                                $variant="disabled"
                                disabled
                                title="La ficha estará disponible cuando el servicio sea completado"
                              >
                                Ficha en Proceso
                              </ActionButton>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </TableServices>
            </TableContainer>
          </MainContent>
         </Container>
        </ContainerHistoryServices>
      </PageContainer>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
      )}
    </>
  );
};

export default HistoryServicesPage;