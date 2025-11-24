import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import BaseFormModal from "../common/BaseFormModal";

import { handleCreateMaintenanceReportAd } from "../../controllers/administrator/createMaintenanceReportAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import VerificationList from "./VerificationList";

const FormCreateMaintenanceReportAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [technicals, setTechnicals] = useState([]);
  const [verificaciones, setVerificaciones] = useState([]);

  // Cargar selects
  useEffect(() => {
    const fetchData = async () => {
      const clientsResponse = await handleGetListClient();
      setClients(clientsResponse || []);

      const technicalResponse = await handleGetListTechnical();
      setTechnicals(technicalResponse.data || []);
    };

    fetchData();
  }, []);

  const fields = [
    { name: "fecha", label: "Fecha", type: "date" },
    {
      name: "id_cliente",
      label: "Cliente",
      type: "select",
      options: clients.map(c => ({
        value: c.id,
        label: `${c.numero_de_cedula} - ${c.nombre} ${c.apellido}`,
      })),
    },
    {
      name: "id_tecnico",
      label: "Técnico",
      type: "select",
      options: technicals.map(t => ({
        value: t.id,
        label: `${t.numero_de_cedula} - ${t.nombre} ${t.apellido}`,
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

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    const reporte = await handleCreateMaintenanceReportAd({
      ...data,
      id_administrador: parseInt(decoded.id),
      verificaciones
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
      extraContent={
        <VerificationList
          verificaciones={verificaciones}
          setVerificaciones={setVerificaciones}
        />
      }
    />
  );
};

export default FormCreateMaintenanceReportAd;

