




import { administratorService } from "../../services/administrator-service";

const handleCreateVisit = (estimatedDuration, previousNotes, postnotes, scheduledDate, requestId, technicalId, serviceId ) => {
  // Convertir fecha_programada de datetime-local a ISO UTC
  let utcScheduledDate = scheduledDate;
  
  if (scheduledDate) {
    // El datetime-local viene como "2025-12-12T07:32"
    // Necesitamos tratarlo como UTC, no como hora local
    const [datePart, timePart] = scheduledDate.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    
    // Crear fecha UTC directamente
    const utcDate = new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      0,
      0
    ));
    
    utcScheduledDate = utcDate.toISOString();
  }

  return administratorService
    .assignVisit(estimatedDuration, previousNotes, postnotes, utcScheduledDate, requestId, technicalId, serviceId);
};

export {handleCreateVisit};