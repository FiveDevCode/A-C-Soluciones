import BaseDetailModal from "../common/BaseDetailModal";

const stateLabels = {
  programada: "Programada",
  en_camino: "En camino",
  iniciada: "Iniciada",
  completada: "Completada",
  cancelada: "Cancelada",
};

const ViewVisitDetailAd = ({ selected, onClose }) => {
  if (!selected) return null;
  
  const formatDateCO = (value) => {
    if (!value) return "—";
    // Convertir string UTC a Date
    const utcDate = new Date(value);
    // Obtener los componentes UTC
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth();
    const day = utcDate.getUTCDate();
    const hour = utcDate.getUTCHours();
    const minute = utcDate.getUTCMinutes();
    // Ajustar hora Colombia (UTC-5)
    const localDate = new Date(Date.UTC(year, month, day, hour + 5, minute));
    return localDate.toLocaleString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };
  const fields = [
    { label: "Notas previas", value: selected.notas_previas || "Sin notas previas" },
    { label: "Notas posteriores", value: selected.notas_posteriores || "Sin notas posteriores" },
    { label: "Duración estimada", value: selected.duracion_estimada ? `${selected.duracion_estimada} minutos` : "No se especificó" },
    {
      label: "Fecha programada",
      value: selected.fecha_programada ? formatDateCO(selected.fecha_programada) : "No hay fecha programada"
    },
    { label: "Solicitud", value: selected.solicitud_asociada ? `${selected.solicitud_asociada.descripcion}` : "No asignada" },
    { label: "Técnico", value: selected.tecnico_asociado ? `${selected.tecnico_asociado.nombre} ${selected.tecnico_asociado.apellido}` : "No asignado" },
    { label: "Servicio", value: selected.servicio ? selected.servicio.nombre : "No asignado" },
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
