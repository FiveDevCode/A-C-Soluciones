import BaseDetailModal from "../common/BaseDetailModal";

const ViewRequestDetailAd = ({ selected, onClose }) => {
  if (!selected) return null;

  const fields = [
    { label: "Servicio solicitado", value: selected.servicio?.nombre },
    { label: "Descripción", value: selected.descripcion },
    { label: "Comentarios", value: selected.comentarios },
    {
      label: "Fecha de solicitud",
      value: selected.fecha_solicitud
        ? new Date(selected.fecha_solicitud).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    },
    { label: "Dirección del cliente", value: selected.direccion_servicio },
    { label: "Estado", value: selected.estado, isBadge: true },
  ];

  return (
    <BaseDetailModal
      title="Detalle solicitud"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewRequestDetailAd;
