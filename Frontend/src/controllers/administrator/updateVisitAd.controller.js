import { administratorService } from "../../services/administrator-service"

const handleUpdateVisitAd = (id, visitData) => {
  // Convertir fecha_programada de datetime-local a ISO UTC
  if (visitData.fecha_programada) {
    // El datetime-local viene como "2025-12-12T07:32"
    // Necesitamos tratarlo como UTC, no como hora local
    const [datePart, timePart] = visitData.fecha_programada.split('T');
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
    
    visitData.fecha_programada = utcDate.toISOString();
  }
  
  return administratorService.updateVisit(id, visitData);
};

export { handleUpdateVisitAd };