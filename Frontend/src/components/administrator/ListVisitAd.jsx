import { useState, useEffect } from "react";
import BaseTable from "../common/BaseTable";
import ViewVisitDetailAd from "./ViewVisitDetailAd";
import EditVisitAd from "./EditVisitAd";
import FormCreateReportAd from "../administrator/FormCreateReportAd";
import { handleGetPDFIdVisit } from "../../controllers/common/getPDFIdVisit.controller";
const API_KEY = "http://localhost:8000";

const ListVisitAd = ({ visits, reloadData, onSelectRows }) => {
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState(null);

  // Estado donde guardaremos visits + pdf_path
  const [visitsWithPDF, setVisitsWithPDF] = useState([]);

  useEffect(() => {
    const fetchPDFs = async () => {
      if (!visits || visits.length === 0) {
        setVisitsWithPDF([]);
        return;
      }

      const updatedVisits = await Promise.all(
        visits.map(async (v) => {
          try {
            const response = await handleGetPDFIdVisit(v.id);

            return {
              ...v,
              pdf_path: response.data?.[0]?.pdf_path || null,
            };
          } catch (err) {
            return {
              ...v,
              pdf_path: null,
            };
          }
        })
      );

      setVisitsWithPDF(updatedVisits);
    };

    fetchPDFs();
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
      render: (value) => (value ? value : "Sin notas previas"),
    },
    {
      header: "Notas Posteriores",
      accessor: "notas_posteriores",
      render: (value) => (value ? value : "Sin notas posteriores"),
    },
    {
      header: "Fecha Programada",
      accessor: "fecha_programada",
      render: (value) => (value ? value.substring(0, 10) : "Sin fecha"),
    },
    {
      header: "Estado",
      accessor: "estado",
      isBadge: true,
      render: (value) => (value === "en_camino" ? "En camino" : value),
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
