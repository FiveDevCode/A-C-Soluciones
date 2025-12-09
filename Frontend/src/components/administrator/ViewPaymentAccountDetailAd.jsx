import React from "react";
import BaseDetailModal from "../common/BaseDetailModal";

const ViewPaymentAccountDetailAd = ({ selected, onClose }) => {
  if (!selected) return null;

  const fields = [
    { label: "Número de cuenta", value: selected.numero_cuenta },
    {
      label: "Fecha de registro",
      value: new Date(selected.fecha_registro).toLocaleString(
        "es-CO",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ),
    },
    { label: "NIT", value: selected.nit },
    {
      label: "Cliente asociado",
      value: selected.cliente
        ? `${selected.cliente.numero_de_cedula} - ${selected.cliente.nombre} ${selected.cliente.apellido}`
        : "Sin cliente vinculado",
    },
  ];

  return (
    <BaseDetailModal
      title={`Detalle de cuenta de pago #${selected.numero_cuenta}`}
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewPaymentAccountDetailAd;
