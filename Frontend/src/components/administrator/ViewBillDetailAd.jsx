import BaseDetailModal from "../common/BaseDetailModal";

const estadoLabels = {
  pendiente: "Pendiente",
  pagada: "Pagada",
  vencida: "Vencida",
};

const formatDateCO = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatMoneyCO = (value) => {
  if (value == null) return "—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

const ViewBillDetailAd = ({ selected, onClose }) => {
  if (!selected) return null;

  const fields = [
    { label: "Número de factura", value: selected.numero_factura },

    { label: "Fecha de factura", value: formatDateCO(selected.fecha_factura) },

    { label: "Fecha de vencimiento", value: formatDateCO(selected.fecha_vencimiento) },

    { label: "Concepto", value: selected.concepto },

    { label: "Monto facturado", value: formatMoneyCO(selected.monto_facturado) },

    { label: "Abonos", value: selected.abonos ? formatMoneyCO(selected.abonos) : "Sin abonos" },

    { label: "Saldo pendiente", value: formatMoneyCO(selected.saldo_pendiente) },

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
