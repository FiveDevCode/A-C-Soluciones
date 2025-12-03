import { handleGetVisit } from "./getVisit.controller"





const handleGetTechnicalVisit = async(id_visita) => {
  
  const visit = await handleGetVisit(id_visita);
  
  if (!visit?.data?.data?.tecnico_asociado) {
    throw new Error('La visita no tiene un técnico asignado. Por favor, asigne un técnico a la visita antes de crear la ficha de mantenimiento.');
  }
  
  const id_technical = visit.data.data.tecnico_asociado.id;
  return id_technical;

}


export {handleGetTechnicalVisit}