import BaseDetailModal from "../common/BaseDetailModal";

const ViewRequestDetailAd = ({ selected, onClose }) => {
  if (!selected) return null;

  const fields = [
    { label: "Servicio solicitado", value: selected.servicio_solicitud?.nombre },
    { label: "Descripción del servicio", value: selected.servicio_solicitud?.descripcion },
    { label: "Cliente", value: selected.cliente_solicitud ? `${selected.cliente_solicitud.nombre} ${selected.cliente_solicitud.apellido}` : "—" },
    { label: "Teléfono del cliente", value: selected.cliente_solicitud?.telefono },
    { label: "Descripción de la solicitud", value: selected.descripcion },
    { label: "Comentarios", value: selected.comentarios },
    {
      label: "Fecha de solicitud",
      value: selected.fecha_solicitud
        ? new Date(selected.fecha_solicitud).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—",
    },
    { label: "Dirección del servicio", value: selected.direccion_servicio },
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
