import BaseDetailModal from "../common/BaseDetailModal";

const stateLabels = {
  activo: "Activo",
  inactivo: "Inactivo",
};

const ViewClientDetailAd = ({ selected, onClose }) => {
  if (!selected) return null;

  const fields = [
    { label: "Cédula", value: selected.numero_de_cedula },
    { label: "Nombre", value: selected.nombre },
    { label: "Apellido", value: selected.apellido },
    { label: "Teléfono", value: selected.telefono },
    { label: "Dirección", value: selected.direccion },
    { label: "Correo electrónico", value: selected.correo_electronico },
    { label: "Estado", value: stateLabels[selected.estado] || selected.estado, isBadge: true },
  ];

  return (
    <BaseDetailModal
      title="Detalle cliente"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewClientDetailAd;
