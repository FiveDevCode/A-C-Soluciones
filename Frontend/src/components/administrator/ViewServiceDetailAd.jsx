import BaseDetailModal from "../common/BaseDetailModal";

const ViewServiceDetail = ({ selected, onClose }) => {
  if (!selected) return null;


  const formatDateCO = (value) => {
    if (!value) return "—";
    // Convertir string UTC a Date
    const utcDate = new Date(value);
    // Obtener los componentes UTC
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth();
    const day = utcDate.getUTCDate();
    const hour = utcDate.getUTCHours();
    const minute = utcDate.getUTCMinutes();
    // Ajustar hora Colombia (UTC-5)
    const localDate = new Date(Date.UTC(year, month, day, hour - 5, minute));
    return localDate.toLocaleString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };


  const fields = [
    { label: "Nombre del servicio", value: selected.nombre },
    { label: "Descripción", value: selected.descripcion },
    { label: "Estado", value: selected.estado, isBadge: true },
    {
      label: "Fecha de creación",
      value: selected.fecha_creacion ? formatDateCO(selected.fecha_creacion) : "No hay fecha de creación"
    },
  ];

  return (
    <BaseDetailModal
      title="Detalle servicio"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewServiceDetail;
