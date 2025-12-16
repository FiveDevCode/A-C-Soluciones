



import { clientService } from "../../services/client-service";

const handleCreateRequest= (serviceAddress, description, comments, fechaSolicitud, requestId, clientId) => {
    

  return clientService
  .createRequest(serviceAddress, description, comments, fechaSolicitud, requestId, clientId)


};


export {handleCreateRequest};