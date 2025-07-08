import { clientService } from "../../services/client-service"




const handleGetClient = (id) => {

  return clientService
  .getClient(id);

}

export {handleGetClient}