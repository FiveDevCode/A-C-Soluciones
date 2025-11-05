import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import BaseFormModal from "../common/BaseFormModal";
import { handleCreateSubmitPaymentAccount } from "../../controllers/administrator/createPaymentAccountAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";

const FormCreatePaymentAccountAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);

  // 🔹 Cargar clientes disponibles al montar
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await handleGetListClient();
        setClients(response.data || []);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };
    fetchClients();
  }, []);

  // 🔹 Definición de campos del formulario
  const fields = [
    { name: "numero_cuenta", label: "Número de cuenta", type: "text" },
    { name: "fecha_registro", label: "Fecha de registro", type: "date" },
    {
      name: "id_cliente",
      label: "Cliente",
      type: "select",
      options: clients.map((c) => ({
        value: c.id,
        label: `${c.nombre} ${c.apellido}`,
      })),
    },
    { name: "nit", label: "NIT", type: "text" },
  ];

  // 🔹 Acción al enviar el formulario
  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);
    const idAdministrador = parseInt(decoded.id);

    await handleCreateSubmitPaymentAccount(
      data.numero_cuenta,
      data.fecha_registro,
      data.id_cliente,
      idAdministrador,
      data.nit
    );
  };

  return (
    <BaseFormModal
      title="Registrar cuenta de pago"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡La cuenta de pago fue creada con éxito!"
    />
  );
};

export default FormCreatePaymentAccountAd;
