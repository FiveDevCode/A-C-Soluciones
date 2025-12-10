import BaseTable from "../common/BaseTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ListMaintenanceReportAd = ({ reports, reloadData, onSelectRows }) => {
  
  const handleDownloadPDF = async (report) => {
    try {
      // Usar directamente la URL del pdf_path del JSON
      if (report.pdf_path) {
        // Crear un enlace temporal para descargar
        const link = document.createElement('a');
        link.href = report.pdf_path;
        link.download = `Reporte-mantenimiento-${report.id}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("No hay PDF disponible para este reporte.");
      }
    } catch (err) {
      console.error("Error al descargar:", err);
      alert("No se pudo descargar el PDF.");
    }
  };

  const handleViewPDF = async (report) => {
    try {
      // Usar directamente la URL del pdf_path del JSON
      if (report.pdf_path) {
        window.open(report.pdf_path, '_blank');
      } else {
        alert("No hay PDF disponible para este reporte.");
      }
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

        return `${day}/${month}/${year}`;
      }
    },
    { header: "Ciudad", accessor: "ciudad" },
    { header: "Dirección", accessor: "direccion" },
    { header: "Marca generador", accessor: "marca_generador" },
    { header: "Modelo generador", accessor: "modelo_generador" },
    { header: "KVA", accessor: "kva" },
    {
      header: "PDF",
      render: (_, row) => {
        // Verificar si existe pdf_path
        const hasPDF = row.pdf_path;
        
        return (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>

            <button
              style={{
                padding: "6px 10px",
                background: hasPDF ? "#0f172a" : "#94a3b8",
                color: "white",
                borderRadius: "6px",
                cursor: hasPDF ? "pointer" : "not-allowed",
                border: "none"
              }}
              onClick={() => hasPDF && handleViewPDF(row)}
              disabled={!hasPDF}
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
    />
  );
};

export default ListMaintenanceReportAd;