import { commonService } from "../../services/common-service"



const handleGetPDFIdVisit = (id) =>{

  return commonService
  .getPDFIdVisit(id)

}

export {handleGetPDFIdVisit};