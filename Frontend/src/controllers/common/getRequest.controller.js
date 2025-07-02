import { commonService } from "../../services/common-service"





const handleGetRequest = (id_solicitud) => {

  return commonService
  .getRequestId(id_solicitud)


}

export {handleGetRequest}