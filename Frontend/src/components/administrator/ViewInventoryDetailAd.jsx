import React from "react";
import BaseDetailModal from "../common/BaseDetailModal";

const categoryLabels = {
  manuales: "Manual",
  electricas: "Eléctrica",
  medicion: "Medición",
};

const ViewInventoryDetail = ({ selectedTool, onClose }) => {
  if (!selectedTool) return null;

  const fields = [
    { label: "Código", value: selectedTool.codigo },
    { label: "Nombre", value: selectedTool.nombre },
    {
      label: "Categoría",
      value: categoryLabels[selectedTool.categoria] || selectedTool.categoria,
    },
    { label: "Cantidad disponible", value: selectedTool.cantidad_disponible },
    { label: "Estado", value: selectedTool.estado, isBadge: true },
    {
      label: "Estado de la herramienta",
      value: selectedTool.estado_herramienta,
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
