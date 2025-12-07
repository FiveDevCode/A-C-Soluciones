import React, { useEffect, useState } from "react";
import BaseDetailModal from "../common/BaseDetailModal";
import { handleGetClient } from "../../controllers/administrator/getClientAd.controller";

const ViewPaymentAccountDetailAd = ({ selected, onClose }) => {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (selected?.id_cliente) {
        try {
          const response = await handleGetClient(selected.id_cliente);
          setClientData(response.data);
        } catch (error) {
          console.error("Error al cargar cliente asociado:", error);
        }
      }
    };
    fetchClient();
  }, [selected]);

  if (!selected) return null;

  const fields = [
    { label: "Número de cuenta", value: selected.numero_cuenta },
    {
      label: "Fecha de registro",
      value: new Date(selected.fecha_registro).toLocaleString(
        "es-ES",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC"
        }
      ),
    },
    { label: "NIT", value: selected.nit },
    {
      label: "Cliente asociado",
      value: clientData
        ? `${clientData.nombre} ${clientData.apellido}`
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
