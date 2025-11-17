import BaseDetailModal from "../common/BaseDetailModal";

const ViewMaintenanceReportDetailAd = ({ selected, onClose }) => {
  if (!selected) return null;

  const fields = [
    { label: "Fecha", value: selected.fecha },
    { label: "Dirección", value: selected.direccion },
    { label: "Ciudad", value: selected.ciudad },
    { label: "Teléfono", value: selected.telefono },
    { label: "Encargado", value: selected.encargado },
    { label: "Marca generador", value: selected.marca_generador },
    { label: "Modelo generador", value: selected.modelo_generador },
    { label: "KVA", value: selected.kva },
    { label: "Serie generador", value: selected.serie_generador },
    {
      label: "Observaciones finales",
      value: selected.observaciones_finales,
    },
  ];

  return (
    <BaseDetailModal
      title="Detalle reporte de mantenimiento"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewMaintenanceReportDetailAd;
