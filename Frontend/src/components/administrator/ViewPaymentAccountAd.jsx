import React, { useEffect, useState } from "react";
import BaseDetailModal from "../common/BaseDetailModal";
import { handleGetClient } from "../../controllers/administrator/getClientAd.controller";
import accountLogo from "../../assets/administrator/registerPaymentAccount.png";

const ViewPaymentAccountDetailAd = ({ selectedAccount, onClose }) => {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (selectedAccount?.id_cliente) {
        try {
          const response = await handleGetClient(selectedAccount.id_cliente);
          setClientData(response.data);
        } catch (error) {
          console.error("Error al cargar cliente asociado:", error);
        }
      }
    };
    fetchClient();
  }, [selectedAccount]);

  if (!selectedAccount) return null;

  const fields = [
    { label: "Número de cuenta", value: selectedAccount.numero_cuenta },
    {
      label: "Fecha de registro",
      value: new Date(selectedAccount.fecha_registro).toLocaleDateString(
        "es-ES",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ),
    },
    { label: "NIT", value: selectedAccount.nit },
    {
      label: "Cliente asociado",
      value: clientData
        ? `${clientData.nombre} ${clientData.apellido}`
        : "Sin cliente vinculado",
    },
  ];

  return (
    <BaseDetailModal
      title={`Detalle de cuenta de pago #${selectedAccount.numero_cuenta}`}
      image={accountLogo}
      fields={fields}
      onClose={onClose}
      showDelete // opcional: si tu BaseDetailModal admite acción de eliminación
      entityType="cuenta de pago" // texto para confirmación si aplica
    />
  );
};

export default ViewPaymentAccountDetailAd;
