import BaseDetailModal from "../common/BaseDetailModal";

const stateLabels = {
  activo: "Activo",
  inactivo: "Inactivo",
};

const ViewAccountingDetail = ({ selected, onClose }) => {
  if (!selected) return null;
  
  const formatDateCO = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC"
    });
  };

  const fields = [
    { label: "Cédula", value: selected.numero_de_cedula },
    { label: "Nombre", value: selected.nombre },
    { label: "Apellido", value: selected.apellido },
    { label: "Teléfono", value: selected.telefono },
    { label: "Correo electrónico", value: selected.correo_electronico },
    { label: "Fecha de registro", value: formatDateCO(selected.fecha_registro) },
    { label: "Estado", value: stateLabels[selected.estado] || selected.estado, isBadge: true },
  ];

  return (
    <BaseDetailModal
      title="Detalle contador"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewAccountingDetail;
