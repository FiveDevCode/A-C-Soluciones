import BaseDetailModal from "../common/BaseDetailModal";

const stateLabels = {
  activo: "Activo",
  inactivo: "Inactivo",
};

const ViewTechnicalDetailAd = ({ selected, onClose }) => {
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
    { label: "Cédula", value: selected.numero_de_cedula },
    { label: "Nombre", value: selected.nombre },
    { label: "Apellido", value: selected.apellido },
    { label: "Teléfono", value: selected.telefono },
    { label: "Especialidad", value: selected.especialidad },
    { label: "Correo electrónico", value: selected.correo_electronico },
    { label: "Fecha de registro", value: formatDateCO(selected.fecha_registro) },
    { label: "Estado", value: stateLabels[selected.estado] || selected.estado, isBadge: true },
  ];

  return (
    <BaseDetailModal
      title="Detalle técnico"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewTechnicalDetailAd;
