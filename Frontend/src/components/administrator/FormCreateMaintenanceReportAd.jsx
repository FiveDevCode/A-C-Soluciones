import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import BaseFormModal from "../common/BaseFormModal";

import { handleCreateMaintenanceReportAd } from "../../controllers/administrator/createMaintenanceReportAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";

const FormCreateMaintenanceReportAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [technicals, setTechnicals] = useState([]);

  // 🔹 Cargar clientes y técnicos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsResponse = await handleGetListClient();
        setClients(clientsResponse || []);

        const technicalResponse = await handleGetListTechnical();
        setTechnicals(technicalResponse.data || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  // 🔹 Definición de campos del formulario
  const fields = [
    { name: "fecha", label: "Fecha", type: "date" },

    // CLIENTE (SELECT)
    {
      name: "id_cliente",
      label: "Cliente",
      type: "select",
      options: clients.map((c) => ({
        value: c.id,
        label: `${c.numero_de_cedula} - ${c.nombre} ${c.apellido}`,
      })),
    },

    // TÉCNICO (SELECT)
    {
      name: "id_tecnico",
      label: "Técnico",
      type: "select",
      options: technicals.map((t) => ({
        value: t.id,
        label: `${t.numero_de_cedula} - ${t.nombre} ${t.apellido}`, // Me dijiste que viene así
      })),
    },

    { name: "direccion", label: "Dirección", type: "text" },
    { name: "ciudad", label: "Ciudad", type: "text" },
    { name: "telefono", label: "Teléfono", type: "text" },
    { name: "encargado", label: "Encargado", type: "text" },
    { name: "marca_generador", label: "Marca generador", type: "text" },
    { name: "modelo_generador", label: "Modelo generador", type: "text" },
    { name: "kva", label: "KVA", type: "number" },
    { name: "serie_generador", label: "Serie generador", type: "text" },
    {
      name: "observaciones_finales",
      label: "Observaciones finales",
      type: "textarea",
    },
  ];

  // 🔹 Acción al enviar el formulario
  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreateMaintenanceReportAd({
      ...data,
      id_administrador: parseInt(decoded.id),
    });
  };

  return (
    <BaseFormModal
      title="Crear reporte de mantenimiento"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Reporte registrado exitosamente!"
    />
  );
};

export default FormCreateMaintenanceReportAd;
