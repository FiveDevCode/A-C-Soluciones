import { useState, useEffect } from "react";
import styled from "styled-components";
import { handleGetHistoryServiceByCliente } from "../../controllers/client/getHistoryServiceByCliente.controller";
import { handleGetPDFIdVisit } from "../../controllers/common/getPDFIdVisit.controller";
import { jwtDecode } from "jwt-decode";
import MenuSideCl from "../../components/client/MenuSideCl";
import { useMenu } from "../../components/client/MenuContext";
import Toast from "../../components/common/Toast";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import FilterHistoryServicesCl from "../../components/client/FilterHistoryServicesCl";
import ListHistoryServicesCl from "../../components/client/ListHistoryServicesCl";

const API_KEY = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PageContainer = styled.div`
  margin-left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  margin-top: 0;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

  @media screen and (max-width: 1280px) {
    margin-left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
`;

const Card = styled.div`
  background-color: white;
  margin: 0 auto 0 auto;
  align-self: center;
  padding: 0 20px;
  padding-bottom: 20px;
  width: 85%;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 0 rgba(0,0,0,0.1);

  @media (max-width: 1350px) {
    margin: 0 10px 0 10px;
    padding: 0 15px 15px 15px;
    width: 95%;
  }
`;

const HistoryServicesPage = () => {
  const { collapsed } = useMenu();
  const [historyServices, setHistoryServices] = useState([]);
  const [filteredHistoryServices, setFilteredHistoryServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const loadHistoryServices = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const decoded = jwtDecode(token);
    const clienteId = decoded.id;

    try {
      setLoading(true);
      const response = await handleGetHistoryServiceByCliente(clienteId);
      setHistoryServices(response.data.data);
      setFilteredHistoryServices(response.data.data);
    } catch (error) {
      console.error("Error al obtener el historial de servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistoryServices();
  }, []);

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
      const pdfUrl = `${API_KEY}/descargar/${fileName}`;
      
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
        <BaseHeaderSection
          headerTitle="HISTORIAL DE VISITAS"
          sectionTitle="Mi historial de visitas"
          onRefresh={loadHistoryServices}
          filterComponent={
            <FilterHistoryServicesCl
              historyServices={historyServices}
              onFilteredChange={setFilteredHistoryServices}
            />
          }
        />

        <Card>
          {loading ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Cargando historial...
            </p>
          ) : (
            <ListHistoryServicesCl
              historyServices={filteredHistoryServices}
              onViewReport={handleViewReport}
            />
          )}
        </Card>
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