import { useState, useEffect } from "react";
import BaseTable from "../common/BaseTable";
import ViewVisitDetailAd from "./ViewVisitDetailAd";
import EditVisitAd from "./EditVisitAd";
import FormCreateReportAd from "../administrator/FormCreateReportAd";
import { commonService } from "../../services/common-service";
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
      }
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
