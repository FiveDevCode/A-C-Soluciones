import React, { useEffect, useState, useRef } from "react";
import { handleGetPaymentAccountAd } from "../../controllers/administrator/getPaymentAccountAd.controller";
import { handleUpdatePaymentAccountAd } from "../../controllers/administrator/updatePaymentAccountAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import accountIcon from "../../assets/administrator/registerPaymentAccount.png";
import BaseEditModal from "../common/BaseEditModalAd";

const EditPaymentAccountAd = ({ selected, onClose, onSuccess }) => {
  const selectedIdRef = useRef(selected?.id);
  const [accountData, setAccountData] = useState(null);
  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountRes, clientsRes] = await Promise.all([
          handleGetPaymentAccountAd(selectedIdRef.current),
          handleGetListClient(),
        ]);
        setAccountData(accountRes.data);
        setClientList(clientsRes || []);
      } catch (error) {
        console.error("Error al cargar datos de cuenta:", error);
      }
    };
    if (selectedIdRef.current) fetchData();
  }, []);

  if (!accountData) return null;

  const clientOptions = clientList.map((c) => ({
    value: c.id,
    label: `${c.nombre} ${c.apellido}`,
  }));

  const fields = [
    { name: "numero_cuenta", label: "Número de cuenta", type: "text" },
    { name: "nit", label: "NIT", type: "text" },
    {
      name: "id_cliente",
      label: "Cliente asociado",
      type: "autocomplete",
      options: clientList.map(c => ({ value: c.id, label: `${c.numero_de_cedula} - ${c.nombre} ${c.apellido}` }))
    },
  ];

  const initialData = {
    numero_cuenta: accountData.numero_cuenta || "",
    fecha_registro: accountData.fecha_registro
      ? accountData.fecha_registro.split("T")[0]
      : "",
    nit: accountData.nit || "",
    id_cliente: accountData.id_cliente || "",
  };

  const handleSubmit = async (data) => {
    await handleUpdatePaymentAccountAd(selectedIdRef.current, data);
  };

  return (
    <BaseEditModal
      title={`Editar cuenta de pago #${accountData.numero_cuenta}`}
      image={accountIcon}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Cuenta de pago actualizada exitosamente!"
    />
  );
};

export default React.memo(EditPaymentAccountAd);
