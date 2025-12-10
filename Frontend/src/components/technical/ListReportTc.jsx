import styled from "styled-components";
import serviceTehc from "../../assets/technical/serviceTehc.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { Pagination, Stack, Typography } from "@mui/material";

const API_KEY = import.meta.env.VITE_API_URL ;

const ContainerNoti = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media screen and (max-width: 1520px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.25rem;
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Notification = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  min-height: 220px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #91cdffff 0%, #60a5fa 100%);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #91cdffff;
    transform: translateY(-4px);

    &::before {
      transform: scaleX(1);
    }
  }
`;

const NotificationDescription = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex: 1;
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NotificationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const TitleNoti = styled.h3`
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Date = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: #94a3b8;
  margin: 0;
  margin-top: auto;
`;

const ContainerOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #91cdffff;
  background: none;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background-color: #e3f2fd;
    color: #60a5fa;
  }

  &.download {
    color: #4a8838;
    
    &:hover {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
  }
`;

const ITEMS_PER_PAGE = 6;


const ListReportTc = ({visits}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(visits.length / ITEMS_PER_PAGE);

  const paginatedVisit = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return visits.slice(start, start + ITEMS_PER_PAGE);
  }, [visits, currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString.substring(0, 10);
    }
  };

  const handleDownloadPDF = async (visit) => {
    if (!visit.pdf_path) {
      alert('No hay PDF disponible para este reporte');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      // Extraer solo el nombre del archivo del path (igual que en admin)
      const fileName = visit.pdf_path.split(/[/\\]/).pop();
      
      // Usar la ruta de descarga del backend
      const pdfUrl = `${API_KEY}/descargar/${fileName}`;

      const response = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo descargar el PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `Reporte-${visit.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar el PDF:', err);
      alert('Error al descargar el PDF. Por favor, inténtalo de nuevo.');
    }
  };

  const handleViewPDF = async (visit) => {
    if (!visit.pdf_path) {
      alert('No hay PDF disponible para este reporte');
      return;
    }

    try {
      // Si es una URL de Cloudinary, abrirla directamente
      if (visit.pdf_path.includes('cloudinary.com')) {
        window.open(visit.pdf_path, '_blank');
        return;
      }

      // Si es una ruta local del servidor
      const token = localStorage.getItem('authToken');
      
      // Extraer solo el nombre del archivo del path
      const fileName = visit.pdf_path.split(/[/\\]/).pop();
      
      // Usar la ruta de descarga del backend
      const pdfUrl = `${API_KEY}/descargar/${fileName}`;
      
      const response = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo abrir el PDF');
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    } catch (err) {
      console.error('Error al abrir el PDF:', err);
      alert('Error al abrir el PDF. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <>
      <ContainerNoti>
        {paginatedVisit.map((visit, index) => (
          <Notification key={visit.id || index}>
            <NotificationDescription>
              <ImageWrapper>
                <img src={serviceTehc} alt="Reporte" />
              </ImageWrapper>
              <NotificationInfo>
                <TitleNoti>
                  {visit.notas && visit.notas.length > 50
                    ? `${visit.notas.slice(0, 50)}...`
                    : visit.notas || "Sin notas"}
                </TitleNoti>
                <Description>
                  Cliente: {visit.cliente ? `${visit.cliente.nombre} ${visit.cliente.apellido}` : "Sin cliente"}
                </Description>
                <Date>{formatDate(visit.fecha_programada)}</Date>
              </NotificationInfo>
            </NotificationDescription>
            <ContainerOption>
              {visit.pdf_path && (
                <ActionButton onClick={() => handleViewPDF(visit)}>
                  <span>Ver PDF</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </ActionButton>
              )}
            </ContainerOption>
          </Notification>
        ))}
      </ContainerNoti>
      {totalPages > 1 && (
        <Stack spacing={2} sx={{ mt: 4, alignItems: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '0.95rem',
                '&.Mui-selected': {
                  backgroundColor: '#91cdffff',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#60a5fa',
                  },
                },
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                },
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              mt: 1
            }}
          >
            Página {currentPage} de {totalPages}
          </Typography>
        </Stack>
      )}
    </>
  );
};


export default ListReportTc