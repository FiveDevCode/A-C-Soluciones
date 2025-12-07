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

const ViewVisitDetailAd = ({ selected, onClose, onReady }) => {
  const [service, setService] = useState("");
  const [isLoadingService, setIsLoadingService] = useState(true);
  
  if (!selected) return null;
  
  useEffect(() => {
    const fetchService = async () => {
      setIsLoadingService(true);
      try {
        const response = await handleGetService(selected.servicio_id_fk);
        const serviceData = response.data.data;
        setService(serviceData);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setIsLoadingService(false);
        // Notificar que los datos están listos
        if (onReady) onReady();
      }
    };
    
    fetchService();
  }, [selected.servicio_id_fk, onReady]);
  
  // No mostrar nada hasta que el servicio esté cargado
  if (isLoadingService) {
    return null;
  }

  const fields = [
    { label: "Notas previas", value: selected.notas_previas || "Sin notas previas" },
    { label: "Notas posteriores", value: selected.notas_posteriores || "Sin notas posteriores" },
    { label: "Duración estimada", value: selected.duracion_estimada ? `${selected.duracion_estimada} minutos` : "No se especificó" },
    {
      label: "Fecha programada",
      value: selected.fecha_programada
        ? (() => {
            const d = new Date(selected.fecha_programada);
            const day = String(d.getUTCDate()).padStart(2, "0");
            const month = String(d.getUTCMonth() + 1).padStart(2, "0");
            const year = d.getUTCFullYear();

            let hours = d.getUTCHours();
            const minutes = String(d.getUTCMinutes()).padStart(2, "0");
            const ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12 || 12;

            return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
          })()
        : "No hay fecha programada"
    },
    { label: "Solicitud", value: selected.solicitud_asociada ? `${selected.solicitud_asociada.descripcion}` : "No asignada" },
    { label: "Técnico", value: selected.tecnico_asociado ? `${selected.tecnico_asociado.nombre} ${selected.tecnico_asociado.apellido}` : "No asignado" },
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
