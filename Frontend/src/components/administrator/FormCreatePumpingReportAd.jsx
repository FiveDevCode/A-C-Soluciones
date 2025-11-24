import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import BaseFormModal from "../common/BaseFormModal";

import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleCreatePumpingReportAd } from "../../controllers/administrator/createPumpingReportAd.controller";

import PumpingEquipmentList from "./PumpingEquipmentList";
import PumpingLineParams from "./PumpingLineParams";

const FormCreatePumpingReportAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [technicals, setTechnicals] = useState([]);

  const [equipos, setEquipos] = useState([]);
  const [parametrosLinea, setParametrosLinea] = useState({});

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

  // Campos base del reporte (solo lo que existe en tu JSON)
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
    {
      name: "observaciones_finales",
      label: "Observaciones finales",
      type: "textarea",
    },
  ];

  // Envío del formulario
  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreatePumpingReportAd({
      ...data,
      id_administrador: parseInt(decoded.id),
      equipos,
      parametrosLinea,
    });
  };

  return (
    <BaseFormModal
      title="Crear reporte de bombeo"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Reporte registrado exitosamente!"
      extraContent={
        <>
          <PumpingEquipmentList
            equipos={equipos}
            setEquipos={setEquipos}
          />

          <PumpingLineParams
            parametrosLinea={parametrosLinea}
            setParametrosLinea={setParametrosLinea}
          />
        </>
      }
    />
  );
};

export default FormCreatePumpingReportAd;
