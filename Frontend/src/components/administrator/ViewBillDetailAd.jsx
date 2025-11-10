import BaseDetailModal from "../common/BaseDetailModal";

const estadoLabels = {
  pendiente: "Pendiente",
  pagada: "Pagada",
  vencida: "Vencida",
};

const ViewBillDetailAd = ({ selected, onClose }) => {
  if (!selected) return null;

  const fields = [
    { label: "Número de factura", value: selected.numero_factura },
    {
      label: "Fecha de factura",
      value: new Date(selected.fecha_factura).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    {
      label: "Fecha de vencimiento",
      value: new Date(selected.fecha_vencimiento).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    { label: "Concepto", value: selected.concepto },
    {
      label: "Monto facturado",
      value: `$${Number(selected.monto_facturado).toFixed(2)}`,
    },
    {
      label: "Abonos",
      value: selected.abonos
        ? `$${Number(selected.abonos).toFixed(2)}`
        : "Sin abonos",
    },
    {
      label: "Saldo pendiente",
      value: `$${Number(selected.saldo_pendiente).toFixed(2)}`,
    },
    {
      label: "Estado de factura",
      value: estadoLabels[selected.estado_factura] || selected.estado_factura,
      isBadge: true,
    },
  ];

  return (
    <BaseDetailModal
      title="Detalle factura"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewBillDetailAd;
