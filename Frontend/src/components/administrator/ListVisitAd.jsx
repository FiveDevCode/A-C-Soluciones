import { useState, useEffect, useRef } from "react";
import BaseTable from "../common/BaseTable";
import ViewVisitDetailAd from "./ViewVisitDetailAd";
import EditVisitAd from "./EditVisitAd";
import FormCreateReportAd from "../administrator/FormCreateReportAd";
import { commonService } from "../../services/common-service";
const API_KEY = "http://localhost:8000";

const ListVisitAd = ({ visits, reloadData, onSelectRows, isLoadingData = false }) => {
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState(null);

  // Estado donde guardaremos visits + pdf_path
  const [visitsWithPDF, setVisitsWithPDF] = useState([]);
  const lastVisitsJsonRef = useRef("");
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const fetchPDFs = async () => {
      if (!visits || visits.length === 0) {
        if (visitsWithPDF.length > 0) {
          setVisitsWithPDF([]);
        }
        lastVisitsJsonRef.current = "[]";
        return;
      }

      // Crear identificador único basado en los datos reales de las visitas
      const currentVisitsJson = JSON.stringify(visits.map(v => ({ id: v.id, estado: v.estado })));
      
      // Si es exactamente el mismo JSON que antes, no hacer nada
      if (currentVisitsJson === lastVisitsJsonRef.current) {
        return;
      }

      // Evitar múltiples llamadas simultáneas
      if (isLoadingRef.current) {
        return;
      }

      isLoadingRef.current = true;
      lastVisitsJsonRef.current = currentVisitsJson;

      try {
        // 🚀 UNA SOLA PETICIÓN para obtener TODAS las fichas
        const response = await commonService.getListToken();
        const allFichas = response.data || [];

        // Crear un mapa de id_visitas -> pdf_path para búsqueda O(1)
        const fichasMap = new Map();
        allFichas.forEach((ficha) => {
          if (ficha.id_visitas && ficha.pdf_path) {
            fichasMap.set(ficha.id_visitas, ficha.pdf_path);
          }
        });

        // Mapear las visitas con sus PDFs correspondientes
        const updatedVisits = visits.map((visit) => ({
          ...visit,
          pdf_path: fichasMap.get(visit.id) || null,
        }));

        setVisitsWithPDF(updatedVisits);
      } catch (err) {
        console.error("Error al obtener fichas:", err);
        // En caso de error, mostrar visitas sin PDF
        setVisitsWithPDF(visits.map((v) => ({ ...v, pdf_path: null })));
      } finally {
        isLoadingRef.current = false;
      }
    };

    fetchPDFs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visits]);

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
        const date = new Date(value);
        return date.toLocaleDateString("es-CO");
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
        ) : (
          // ========================
          // ✔ BOTÓN GENERAR REPORTE
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
        EditComponent={(props) => (
          <EditVisitAd {...props} onSuccess={reloadData} />
        )}
        ViewComponent={(props) => <ViewVisitDetailAd {...props} />}
        onSelectRows={onSelectRows}
        isLoadingData={isLoadingData}
        mobileConfig={{
          title: "fecha_programada",
          subtitle: "notas_previas",
          renderExtra: (row) => {
            if (!row.pdf_path) {
              // Mostrar botón de generar reporte
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
                      fontWeight: 600
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
