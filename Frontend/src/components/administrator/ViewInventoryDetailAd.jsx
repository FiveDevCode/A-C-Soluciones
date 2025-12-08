import BaseDetailModal from "../common/BaseDetailModal";

const categoryLabels = {
  manuales: "Manual",
  electricas: "Eléctrica",
  medicion: "Medición",
};

const ViewInventoryDetail = ({ selected, onClose }) => {
  console.log(selected)
  if (!selected) return null;

  const fields = [
    { label: "Código", value: selected.codigo },
    { label: "Nombre", value: selected.nombre },
    {
      label: "Categoría",
      value: categoryLabels[selected.categoria] || selected.categoria,
    },
    { label: "Cantidad disponible", value: selected.cantidad_disponible },
    { label: "Estado", value: selected.estado, isBadge: true },
    {
      label: "Estado de la herramienta",
      value: selected.estado_herramienta,
    },
  ];

  return (
    <BaseDetailModal
      title="Detalle herramienta"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewInventoryDetail;
