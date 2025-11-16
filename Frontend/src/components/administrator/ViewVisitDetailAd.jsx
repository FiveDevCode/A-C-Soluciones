import { use, useEffect, useState } from "react";
import BaseDetailModal from "../common/BaseDetailModal";
import { handleGetService } from "../../controllers/administrator/getServiceAd.controller";

const stateLabels = {
  programada: "Programada",
  en_camino: "En camino",
  iniciada: "Iniciada",
  completada: "Completada",
  cancelada: "Cancelada",
};

const ViewVisitDetailAd = ({ selected, onClose }) => {
  const [service, setService] = useState("");
  
  if (!selected) return null;
  
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await handleGetService(selected.servicio_id_fk);
        const serviceData = response.data.data;
        setService(serviceData);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
    
    fetchService();
  }, [selected.servicio_id_fk]);
  

  const fields = [
    { label: "Notas previas", value: selected.notas_previas || "Sin notas previas" },
    { label: "Notas posteriores", value: selected.notas_posteriores || "Sin notas posteriores" },
    { label: "Duración estimada", value: selected.duracion_estimada ? `${selected.duracion_estimada} minutos` : "No se especificó" },
    {
      label: "Fecha programada",
      value: selected.fecha_programada
        ? (() => {
            const d = new Date(selected.fecha_programada);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();

            let hours = d.getHours();
            const minutes = String(d.getMinutes()).padStart(2, "0");
            const ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12 || 12;

            // Formato Colombiano: DD/MM/YYYY - hh:mm am/pm
            return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
          })()
        : "No hay fecha programada"
    },
    { label: "Solicitud", value: selected.solicitud ? `${selected.solicitud.descripcion}` : "No asignada" },
    { label: "Técnico", value: selected.tecnico ? `${selected.tecnico.nombre} ${selected.tecnico.apellido}` : "No asignado" },
    { label: "Servicio", value: service ? service.nombre : "No asignado" },
    { label: "Estado", value: stateLabels[selected.estado] || selected.estado, isBadge: true },
  ];

  return (
    <BaseDetailModal
      title="Detalle visita"
      fields={fields}
      onClose={onClose}
    />
  );
};

export default ViewVisitDetailAd;
