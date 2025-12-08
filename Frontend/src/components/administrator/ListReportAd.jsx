import BaseTable from "../common/BaseTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ViewReportDetailAd from "../administrator/ViewReportDetailAd";

const API_KEY = "http://localhost:8000";
const ListReportAd = ({ visits, reloadData, onSelectRows }) => {

  const handleDownloadPDF = async (visit) => {
    try {
      const token = localStorage.getItem('authToken');
      const relativePath = visit.pdf_path.replace(/^uploads[\\/]/, '').replace(/\\/g, '/');
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
      link.download = `Reporte-visita-${visit.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar:", err);
      alert("No se pudo descargar el PDF.");
    }
  };

  const handleViewPDF = async (visit) => {
    try {
      const token = localStorage.getItem('authToken');
      const relativePath = visit.pdf_path.replace(/^uploads[\\/]/, '').replace(/\\/g, '/');
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
    {
      header: "Fecha programada",
      accessor: "fecha_programada",
      render: (value) => {
        if (!value) return "No hay fecha programada";

        const d = new Date(value);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;

        return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
      },
    },
    { header: "Notas previas", accessor: "notas_previas" },
    { header: "Notas posteriores", accessor: "notas_posteriores" },
    {
      header: "PDF",
      accessor: "pdf_path",
      render: (_, row) => (
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
      )
    }
  ];

  return (
    <BaseTable
      data={visits}
      columns={columns}
      emptyMessage="No hay reportes generados"
      onSelectRows={onSelectRows}
      mobileConfig={{
        title: "fecha_programada",
        subtitle: "notas_previas",
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

export default ListReportAd;
