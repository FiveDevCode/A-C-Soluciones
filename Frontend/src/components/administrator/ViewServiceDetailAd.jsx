import BaseDetailModal from "../common/BaseDetailModal";

const ViewServiceDetail = ({ selected, onClose }) => {
  if (!selected) return null;

  const fields = [
    { label: "Nombre del servicio", value: selected.nombre },
    { label: "Descripción", value: selected.descripcion },
    { label: "Estado", value: selected.estado, isBadge: true },
    {
      label: "Fecha de creación",
      value: new Date(selected.fecha_creacion).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
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
