



import { clientService } from "../../services/client-service";

const handleCreateRequest= (serviceAddress, description, comments, requestId, clientId) => {
    

  return clientService
  .createRequest(serviceAddress, description, comments, requestId, clientId)


};


export {handleCreateRequest};