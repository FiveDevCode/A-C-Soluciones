import BaseDetailModal from "../common/BaseDetailModal";

const ViewPumpingReportDetailAd = ({ selected, onClose }) => {
  if (!selected) return null;

  const fields = [
    { label: "Fecha", value: selected.fecha },
    { label: "Dirección", value: selected.direccion },
    { label: "Ciudad", value: selected.ciudad },
    { label: "Teléfono", value: selected.telefono },
    { label: "Encargado", value: selected.encargado },
    {
      label: "Observaciones finales",
      value: selected.observaciones_finales,
    },
    {
      label: "Voltaje línea",
      value: selected.parametrosLinea?.voltaje_linea,
    },
    {
      label: "Corriente línea",
      value: selected.parametrosLinea?.corriente_linea,
    },
    {
      label: "Presión succión",
      value: selected.parametrosLinea?.presion_succion,
    },
    {
      label: "Presión descarga",
      value: selected.parametrosLinea?.presion_descarga,
    },
    {
      label: "Observaciones parámetros línea",
      value: selected.parametrosLinea?.observaciones,
    },
  ];

  return (
    <BaseDetailModal
      title="Detalle reporte de bombeo"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewPumpingReportDetailAd;
