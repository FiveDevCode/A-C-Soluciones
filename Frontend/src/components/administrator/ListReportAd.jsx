import BaseTable from "../common/BaseTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ViewReportDetailAd from "../administrator/ViewReportDetailAd";

const API_KEY = "http://localhost:8000";

const ListReportAd = ({ reports, reloadData, onSelectRows, isLoadingData = false }) => {

  const handleDownloadPDF = async (report) => {
    try {
      // Si es URL de Cloudinary, descargar directamente
      if (report.pdf_path.includes('cloudinary.com')) {
        const link = document.createElement('a');
        link.href = report.pdf_path;
        link.download = `Reporte-${report.id}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        link.remove();
        return;
      }

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
      link.download = `Reporte-${report.id}.pdf`;
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
      // Si es URL de Cloudinary, abrir directamente
      if (report.pdf_path.includes('cloudinary.com')) {
        window.open(report.pdf_path, "_blank");
        return;
      }

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
    {
      header: "Cliente",
      accessor: "cliente_ficha",
      render: (value) => {
        if (!value) return "—";
        return `${value.nombre} ${value.apellido}`;
      }
    },
    {
      header: "Técnico",
      accessor: "tecnico_ficha",
      render: (value) => {
        if (!value) return "—";
        return `${value.nombre} ${value.apellido}`;
      }
    },
    {
      header: "Servicio",
      accessor: "visita_asociada",
      render: (value) => {
        if (!value?.servicio) return "—";
        return value.servicio.nombre;
      }
    },
    {
      header: "Fecha programada",
      accessor: "visita_asociada",
      render: (value) => {
        if (!value?.fecha_programada) return "—";

        const d = new Date(value.fecha_programada);
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
      header: "Nota",
      accessor: "visita_asociada",
      render: (value) => {
        if (!value?.notas) return "—";
        return value.notas.length > 50 ? value.notas.slice(0, 50) + "..." : value.notas;
      }
    },
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
              border: "none",
              fontWeight: 600,
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
              border: "none",
              fontWeight: 600,
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
      data={reports || []}
      columns={columns}
      emptyMessage="No hay reportes generados"
      ViewComponent={ViewReportDetailAd}
      onSelectRows={onSelectRows}
      isLoadingData={isLoadingData}
      mobileConfig={{
        title: "visita_asociada",
        titleRender: (value) => {
          if (!value?.fecha_programada) return "Sin fecha";
          const d = new Date(value.fecha_programada);
          const day = String(d.getUTCDate()).padStart(2, "0");
          const month = String(d.getUTCMonth() + 1).padStart(2, "0");
          const year = d.getUTCFullYear();
          return `${day}/${month}/${year}`;
        },
        subtitle: "cliente_ficha",
        subtitleRender: (value) => {
          if (!value) return "—";
          return `${value.nombre} ${value.apellido}`;
        },
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