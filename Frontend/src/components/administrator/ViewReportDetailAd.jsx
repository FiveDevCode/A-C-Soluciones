import BaseDetailModal from "../common/BaseDetailModal";

const ViewReportDetailAd = ({ selected, onClose }) => {
  if (!selected) return null;

  const fields = [
    { label: "Introducción", value: selected.introduccion },
    { label: "Fecha del mantenimiento", value: selected.fecha_de_mantenimiento },
    { label: "Detalles del servicio", value: selected.detalles_servicio },
    { label: "Observaciones", value: selected.observaciones },
    { label: "Estado antes", value: selected.estado_antes },
    { label: "Descripción del trabajo", value: selected.descripcion_trabajo },
    { label: "Materiales utilizados", value: selected.materiales_utilizados },
    { label: "Estado final", value: selected.estado_final },
    { label: "Tiempo de trabajo", value: selected.tiempo_de_trabajo },
    { label: "Recomendaciones", value: selected.recomendaciones },
  ];

  return (
    <BaseDetailModal
      title="Detalle ficha de mantenimiento"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewReportDetailAd;
