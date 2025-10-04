import { handleGetVisit } from "./getVisit.controller"





const handleGetTechnicalVisit = async(id_visita) => {
  
  const visit = await handleGetVisit(id_visita);
  const id_technical = visit.data.data.tecnico.id;
  return id_technical;

}


export {handleGetTechnicalVisit}