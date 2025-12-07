import BaseTable from "../common/BaseTable";
import ViewMaintenanceReportDetailAd from "./ViewMaintenanceReportDetailAd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const API_KEY = "http://localhost:8000";

const ListMaintenanceReportAd = ({ reports, reloadData, onSelectRows }) => {
  
  const handleDownloadPDF = async (report) => {
    try {
      const token = localStorage.getItem('authToken');
      // Usar el endpoint del backend para descargar el PDF por ID
      const publicUrl = `${API_KEY}/api/reportes-mantenimiento/${report.id}/pdf`;

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
      link.download = `Reporte-mantenimiento-${report.id}.pdf`;
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
      // Usar el endpoint del backend para ver el PDF por ID
      const publicUrl = `${API_KEY}/api/reportes-mantenimiento/${report.id}/pdf`;

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
    { 
      header: "Fecha", 
      accessor: "fecha",
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
    { header: "Ciudad", accessor: "ciudad" },
    { header: "Dirección", accessor: "direccion" },
    { header: "Encargado", accessor: "encargado" },
    { header: "Marca generador", accessor: "marca_generador" },
    { header: "Modelo generador", accessor: "modelo_generador" },
    { header: "KVA", accessor: "kva" },
    {
      header: "PDF",
      render: (_, row) => {
        // Todos los reportes tienen PDF generado automáticamente
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
      ViewComponent={(props) => (
        <ViewMaintenanceReportDetailAd {...props} />
      )}
      onSelectRows={onSelectRows}
      mobileConfig={{
        title: "fecha",
        subtitle: "ciudad",
        renderExtra: (row) => (
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
        )
      }}
    />
  );
};

export default ListMaintenanceReportAd;
