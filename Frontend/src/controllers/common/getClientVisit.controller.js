import { handleGetRequest } from "./getRequest.controller"
import { handleGetVisit } from "./getVisit.controller"




const handleGetClientVisit = async(id_visita) => {

  const visita = await handleGetVisit(id_visita)
  const id_solicitud = visita.data.data.solicitud_id_fk

  const solicitud = await handleGetRequest(id_solicitud)
  return solicitud.data.cliente_id_fk;

}


export {handleGetClientVisit}