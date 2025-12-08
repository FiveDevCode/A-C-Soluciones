import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Tooltip } from "@mui/material";
import BaseTable from "../common/BaseTable";
import ViewVisitDetailAd from "./ViewVisitDetailAd";
import EditVisitAd from "./EditVisitAd";
import FormCreateReportAd from "../administrator/FormCreateReportAd";
import { commonService } from "../../services/common-service";
const API_KEY = "http://localhost:8000";

const FICHAS_CACHE_KEY = 'fichas_pdfs_cache';
const FICHAS_CACHE_TIMESTAMP = 'fichas_pdfs_timestamp';
const FICHAS_VISITS_KEY = 'fichas_visits_snapshot';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const ListVisitAd = ({ visits, reloadData, onSelectRows, isLoadingData = false }) => {
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState(null);

  // Función auxiliar para obtener el mapa inicial del caché
  const getInitialPdfMap = () => {
    try {
      const cached = sessionStorage.getItem(FICHAS_CACHE_KEY);
      const timestamp = sessionStorage.getItem(FICHAS_CACHE_TIMESTAMP);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < CACHE_DURATION) {
          const fichas = JSON.parse(cached);
          const map = new Map();
          fichas.forEach((ficha) => {
            if (ficha.id_visitas && ficha.pdf_path) {
              map.set(ficha.id_visitas, ficha.pdf_path);
            }
          });
          return map;
        }
      }
    } catch (err) {
      console.error('Error al leer caché inicial:', err);
    }
    return new Map();
  };

  // Estados para manejo de PDFs
  const [pdfMap, setPdfMap] = useState(getInitialPdfMap);
  const lastVisitsJsonRef = useRef(sessionStorage.getItem(FICHAS_VISITS_KEY) || "");
  const isLoadingRef = useRef(false);
  const hasFetchedPDFsRef = useRef(false);

  // Función para obtener fichas del caché
  const getCachedFichas = () => {
    try {
      const cached = sessionStorage.getItem(FICHAS_CACHE_KEY);
      const timestamp = sessionStorage.getItem(FICHAS_CACHE_TIMESTAMP);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < CACHE_DURATION) {
          return JSON.parse(cached);
        }
      }
    } catch (err) {
      console.error('Error al leer caché de fichas:', err);
    }
    return null;
  };

  // Función para guardar fichas en el caché
  const setCachedFichas = (fichas, visitsSnapshot) => {
    try {
      sessionStorage.setItem(FICHAS_CACHE_KEY, JSON.stringify(fichas));
      sessionStorage.setItem(FICHAS_CACHE_TIMESTAMP, Date.now().toString());
      sessionStorage.setItem(FICHAS_VISITS_KEY, visitsSnapshot);
    } catch (err) {
      console.error('Error al guardar caché de fichas:', err);
    }
  };

  // Cargar fichas cuando cambian las visitas
  useEffect(() => {
    const loadFichas = async () => {
      if (isLoadingRef.current) return;
      if (!visits || visits.length === 0) {
        return;
      }

      // Verificar si las visitas han cambiado (por ID o cantidad)
      const currentVisitsJson = JSON.stringify(visits.map(v => v.id).sort());
      
      // Si las visitas cambiaron (nueva recarga), invalidar caché de fichas
      if (currentVisitsJson !== lastVisitsJsonRef.current) {
        // Las visitas cambiaron, necesitamos recargar las fichas
        isLoadingRef.current = true;
        lastVisitsJsonRef.current = currentVisitsJson;

        try {
          // Hacer la petición SIN usar caché
          const response = await commonService.getListToken();
          const allFichas = response.data || [];
          
          // Guardar en caché junto con el snapshot de visitas
          setCachedFichas(allFichas, currentVisitsJson);

          // Crear el mapa
          const fichasMap = new Map();
          allFichas.forEach((ficha) => {
            if (ficha.id_visitas && ficha.pdf_path) {
              fichasMap.set(ficha.id_visitas, ficha.pdf_path);
            }
          });
          
          setPdfMap(fichasMap);
          hasFetchedPDFsRef.current = true;
        } catch (err) {
          console.error("Error al obtener fichas:", err);
        } finally {
          isLoadingRef.current = false;
        }
      } else {
        // Las visitas NO cambiaron, podemos usar el caché
        const cachedFichas = getCachedFichas();
        
        if (cachedFichas && pdfMap.size === 0) {
          // Usar caché solo si el mapa está vacío
          const fichasMap = new Map();
          cachedFichas.forEach((ficha) => {
            if (ficha.id_visitas && ficha.pdf_path) {
              fichasMap.set(ficha.id_visitas, ficha.pdf_path);
            }
          });
          setPdfMap(fichasMap);
        }
      }
    };

    loadFichas();
  }, [visits]); // Se ejecuta cuando cambian las visitas

  // Combinar visits con pdf_path usando useMemo - ESTABLE
  const visitsWithPDF = useMemo(() => {
    if (!visits || visits.length === 0) {
      return [];
    }

    // Mapear las visitas con sus PDFs correspondientes
    return visits.map((visit) => ({
      ...visit,
      pdf_path: pdfMap.get(visit.id) || null,
    }));
  }, [visits, pdfMap]);

  // Crear componentes estables para evitar re-montajes
  const ViewComponentMemo = useCallback((props) => <ViewVisitDetailAd {...props} />, []);
  const EditComponentMemo = useCallback((props) => <EditVisitAd {...props} onSuccess={reloadData} />, [reloadData]);

  // Abrir modal de crear reporte
  const handleOpenReport = (row) => {
    setSelectedVisitId(row.id);
    setOpenReportModal(true);
  };

  const handleCloseReport = () => {
    setOpenReportModal(false);
    setSelectedVisitId(null);
    reloadData();
  };

  const columns = [
    {
      header: "Notas Previas",
      accessor: "notas_previas",
      render: (value) => {
        if (!value) return "—";
        return value.length > 50 ? value.slice(0, 50) + "..." : value;
      }
    },
    {
      header: "Notas Posteriores",
      accessor: "notas_posteriores",
      render: (value) => {
        if (!value) return "—";
        return value.length > 50 ? value.slice(0, 50) + "..." : value;
      }
    },
    {
      header: "Fecha Programada",
      accessor: "fecha_programada",
      render: (value) => {
        if (!value) return "—";
        
        const d = new Date(value);
        const day = String(d.getUTCDate()).padStart(2, "0");
        const month = String(d.getUTCMonth() + 1).padStart(2, "0");
        const year = d.getUTCFullYear();

        let hours = d.getUTCHours();
        const minutes = String(d.getUTCMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;

        return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
      }
    },
    {
      header: "Estado",
      accessor: "estado",
      isBadge: true,
    },
    {
      header: "Reporte",
      accessor: "pdf_path",
      render: (value, row) =>
        value ? (
          // ========================
          // ✔ BOTÓN VER REPORTE
          // ========================
          <button
            style={{
              padding: "6px 10px",
              background: "#16a34a",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
              border: "none",
              fontWeight: 600,
            }}
            onClick={async () => {
              try {
                const token = localStorage.getItem("authToken");

                const relativePath = value
                  .replace(/^uploads[\\/]/, "")
                  .replace(/\\/g, "/");

                const publicUrl = `${API_KEY}/${relativePath}`;

                const response = await fetch(publicUrl, {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (!response.ok) {
                  throw new Error("No se pudo obtener el PDF");
                }

                const blob = await response.blob();
                const fileURL = URL.createObjectURL(blob);
                window.open(fileURL, "_blank");
              } catch (err) {
                console.error("Error al abrir PDF:", err);
                alert("No se pudo abrir el reporte.");
              }
            }}
          >
            Ver reporte
          </button>
        ) : row.estado !== "completada" ? (
          // ========================
          // ✔ BOTÓN GENERAR REPORTE DESHABILITADO
          // ========================
          <Tooltip 
            title="Solo disponible para visitas completadas" 
            arrow 
            placement="top"
          >
            <span>
              <button
                style={{
                  padding: "6px 10px",
                  background: "#94a3b8",
                  color: "white",
                  borderRadius: "6px",
                  cursor: "not-allowed",
                  border: "none",
                  fontWeight: 600,
                  opacity: 0.6,
                }}
                disabled
              >
                Generar reporte
              </button>
            </span>
          </Tooltip>
        ) : (
          // ========================
          // ✔ BOTÓN GENERAR REPORTE HABILITADO
          // ========================
          <button
            style={{
              padding: "6px 10px",
              background: "#2563eb",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
              border: "none",
              fontWeight: 600,
            }}
            onClick={() => handleOpenReport(row)}
          >
            Generar reporte
          </button>
        ),
    },
  ];

  return (
    <>
      <BaseTable
        data={visitsWithPDF} // 👈 AHORA SÍ USA LA LISTA CON PDF
        columns={columns}
        getBadgeValue={(row) =>
          row.estado === "en_camino" ? "En camino" : row.estado
        }
        emptyMessage="No hay visitas registradas"
        EditComponent={EditComponentMemo}
        ViewComponent={ViewComponentMemo}
        onSelectRows={onSelectRows}
        isLoadingData={isLoadingData}
        mobileConfig={{
          title: "fecha_programada",
          subtitle: "notas_previas",
          renderExtra: (row) => {
            if (!row.pdf_path) {
              // Mostrar botón de generar reporte
              if (row.estado !== "completada") {
                // Botón deshabilitado con tooltip
                return (
                  <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <Tooltip 
                      title="Solo disponible para visitas completadas" 
                      arrow 
                      placement="top"
                    >
                      <span>
                        <button
                          style={{
                            padding: "5px 8px",
                            background: "#94a3b8",
                            color: "white",
                            borderRadius: "6px",
                            cursor: "not-allowed",
                            border: "none",
                            fontSize: "11px",
                            fontWeight: 600,
                            opacity: 0.6,
                          }}
                          disabled
                        >
                          Generar reporte
                        </button>
                      </span>
                    </Tooltip>
                  </div>
                );
              }
              
              // Botón habilitado sin tooltip
              return (
                <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <button
                    style={{
                      padding: "5px 8px",
                      background: "#2563eb",
                      color: "white",
                      borderRadius: "6px",
                      cursor: "pointer",
                      border: "none",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenReport(row);
                    }}
                  >
                    Generar reporte
                  </button>
                </div>
              );
            }
            
            // Mostrar botón de ver reporte
            return (
              <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                <button
                  style={{
                    padding: "5px 8px",
                    background: "#16a34a",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                    border: "none",
                    fontSize: "11px",
                    fontWeight: 600
                  }}
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const token = localStorage.getItem("authToken");
                      const relativePath = row.pdf_path
                        .replace(/^uploads[\\/]/, "")
                        .replace(/\\/g, "/");
                      const publicUrl = `${API_KEY}/${relativePath}`;

                      const response = await fetch(publicUrl, {
                        method: "GET",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });

                      if (!response.ok) {
                        throw new Error("No se pudo obtener el PDF");
                      }

                      const blob = await response.blob();
                      const fileURL = URL.createObjectURL(blob);
                      window.open(fileURL, "_blank");
                    } catch (err) {
                      console.error("Error al abrir PDF:", err);
                      alert("No se pudo abrir el reporte.");
                    }
                  }}
                >
                  Ver reporte
                </button>
              </div>
            );
          }
        }}
      />

      {openReportModal && (
        <FormCreateReportAd
          id={selectedVisitId}
          onClose={handleCloseReport}
          onSuccess={handleCloseReport}
        />
      )}
    </>
  );
};

export default ListVisitAd;
