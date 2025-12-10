import { useState, useCallback } from "react";
import { Tooltip } from "@mui/material";
import BaseTable from "../common/BaseTable";
import ViewVisitDetailAd from "./ViewVisitDetailAd";
import EditVisitAd from "./EditVisitAd";
import FormCreateReportAd from "../administrator/FormCreateReportAd";

const API_KEY = "http://localhost:8000";

const ListVisitAd = ({ visits, reloadData, onSelectRows, isLoadingData = false }) => {
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState(null);

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
    reloadData(); // Recarga visitas (que ya incluyen fichas)
  };

  // Función para abrir PDF
  const handleOpenPDF = async (pdfPath) => {
    try {
      // Si es una URL de Cloudinary, abrirla directamente
      if (pdfPath.includes('cloudinary.com')) {
        window.open(pdfPath, "_blank");
        return;
      }

      const token = localStorage.getItem("authToken");
      const relativePath = pdfPath
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
  };

  const columns = [
    {
      header: "Cliente",
      accessor: "solicitud_asociada",
      render: (value) => {
        if (!value?.cliente_solicitud) return "—";
        const { nombre, apellido } = value.cliente_solicitud;
        return `${nombre} ${apellido}`;
      }
    },
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
      accessor: "ficha_mantenimiento",
      render: (ficha, row) => {
        // Si existe la ficha y tiene PDF
        if (ficha?.pdf_path) {
          return (
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
              onClick={() => handleOpenPDF(ficha.pdf_path)}
            >
              Ver reporte
            </button>
          );
        }

        // Si la visita no está completada
        if (row.estado !== "completada") {
          return (
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
          );
        }

        // Visita completada sin reporte
        return (
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
        );
      },
    },
  ];

  return (
    <>
      <BaseTable
        data={visits || []}
        columns={columns}
        getBadgeValue={(row) =>
          row.estado === "en_camino" ? "En camino" : row.estado
        }
        emptyMessage="No hay visitas registradas"
        EditComponent={EditComponentMemo}
        ViewComponent={ViewComponentMemo}
        onSelectRows={onSelectRows}
        isLoadingData={isLoadingData}
        isEditDisabled={(row) => row.estado === "completada" || row.estado === "cancelada"}
        mobileConfig={{
          title: "fecha_programada",
          subtitle: "notas_previas",
          renderExtra: (row) => {
            const ficha = row.ficha_mantenimiento;

            // Si existe PDF, mostrar botón de ver reporte
            if (ficha?.pdf_path) {
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPDF(ficha.pdf_path);
                    }}
                  >
                    Ver reporte
                  </button>
                </div>
              );
            }

            // Si la visita no está completada
            if (row.estado !== "completada") {
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

            // Visita completada sin reporte
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