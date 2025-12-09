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
        setClients(response || []);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };
    fetchClients();
  }, []);

  // 🔹 Definición de campos del formulario
  const fields = [
    { name: "numero_cuenta", label: "Número de cuenta", type: "text" },
    {
      name: "id_cliente",
      label: "Cliente",
      type: "autocomplete",
      options: clients.map((c) => ({
        value: c.id,
        label: `${c.numero_de_cedula} - ${c.nombre} ${c.apellido}`,
      })),
      required: true
    },
    { name: "nit", label: "NIT", type: "text" },
  ];

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    // Solo enviar la fecha en formato YYYY-MM-DD
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const fechaSolo = `${year}-${month}-${day}`;

    await handleCreateSubmitPaymentAccount({
      ...data,
      fecha_registro: fechaSolo,
      id_admin: parseInt(decoded.id),
    });
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
