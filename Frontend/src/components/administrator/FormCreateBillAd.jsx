import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import BaseFormModal from "../common/BaseFormModal";
import { handleCreateBill } from "../../controllers/administrator/createBillAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";

const FormCreateBillAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);

  // 🔹 Cargar lista de clientes al montar
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await handleGetListClient();
        console.log(response);
        setClients(response || []);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };
    fetchClients();
  }, []);

  // 🔹 Campos del formulario
  const fields = [
    { name: "numero_factura", label: "Número de factura", type: "text" },
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
    { name: "fecha_factura", label: "Fecha de factura", type: "date" },
    { name: "concepto", label: "Concepto", type: "textarea" },
    { name: "monto_facturado", label: "Monto facturado", type: "number" },
    { name: "abonos", label: "Abonos", type: "number" },
    { name: "saldo_pendiente", label: "Saldo pendiente", type: "number" },
    { name: "fecha_vencimiento", label: "Fecha de vencimiento", type: "date" }
  ];

  // 🔹 Envío del formulario
  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreateBill({
      ...data,
      id_admin: parseInt(decoded.id),
    });
  };

  return (
    <BaseFormModal
      title="Registrar factura"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Factura registrada exitosamente!"
    />
  );
};

export default FormCreateBillAd;
