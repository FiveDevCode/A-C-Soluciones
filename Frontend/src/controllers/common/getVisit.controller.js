import { commonService } from "../../services/common-service"


const handleGetVisit = (id_visita) => {
  
  return commonService
  .getVisitId(id_visita)

}

export {handleGetVisit}