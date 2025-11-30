import BaseTable from "../common/BaseTable";
import ViewPumpingReportDetailAd from "./ViewPumpingReportDetailAd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const API_KEY = "http://localhost:8000";

const ListPumpingReportAd = ({ reports, reloadData, onSelectRows }) => {
  
  const handleDownloadPDF = async (report) => {
    try {
      const token = localStorage.getItem('authToken');
      const relativePath = report.pdf_path.replace(/^uploads[\\/]/, '').replace(/\\/g, '/');
      const publicUrl = `${API_KEY}/${relativePath}`;

      const response = await fetch(publicUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("No se pudo descargar el PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Reporte-bombeo-${report.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar:", err);
      alert("No se pudo descargar el PDF.");
    }
  };

  const handleViewPDF = async (report) => {
    try {
      const token = localStorage.getItem('authToken');
      const relativePath = report.pdf_path.replace(/^uploads[\\/]/, '').replace(/\\/g, '/');
      const publicUrl = `${API_KEY}/${relativePath}`;

      const response = await fetch(publicUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("No se pudo abrir el PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error al abrir:", err);
      alert("No se pudo abrir el PDF.");
    }
  };

  const columns = [
    { header: "Fecha", accessor: "fecha" },
    { header: "Ciudad", accessor: "ciudad" },
    { header: "Dirección", accessor: "direccion" },
    { header: "Encargado", accessor: "encargado" },
    { header: "Teléfono", accessor: "telefono" },
    { 
      header: "N° Equipos",
      render: (value, row) => row.equipos?.length || 0
    },
    {
      header: "PDF",
      accessor: "pdf_path",
      render: (_, row) => {
        if (!row.pdf_path) {
          return <span style={{ color: "#94a3b8" }}>Sin PDF</span>;
        }
        return (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button
              style={{
                padding: "6px 10px",
                background: "#2563eb",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer",
                border: "none"
              }}
              onClick={() => handleDownloadPDF(row)}
            >
              <FontAwesomeIcon icon={faDownload} /> Descargar
            </button>

            <button
              style={{
                padding: "6px 10px",
                background: "#0f172a",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer",
                border: "none"
              }}
              onClick={() => handleViewPDF(row)}
            >
              Ver <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <BaseTable
      data={reports}
      columns={columns}
      emptyMessage="No hay reportes registrados"
      ViewComponent={(props) => <ViewPumpingReportDetailAd {...props} />}
      onSelectRows={onSelectRows}
      mobileConfig={{
        title: "fecha",
        subtitle: "ciudad",
        renderExtra: (row) => {
          if (!row.pdf_path) return null;
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
                  handleDownloadPDF(row);
                }}
              >
                <FontAwesomeIcon icon={faDownload} /> Descargar
              </button>
              <button
                style={{
                  padding: "5px 8px",
                  background: "#0f172a",
                  color: "white",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: "none",
                  fontSize: "11px",
                  fontWeight: 600
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPDF(row);
                }}
              >
                Ver <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          );
        }
      }}
    />
  );
};

export default ListPumpingReportAd;
