import { administratorService } from "../../services/administrator-service"




const handleDeleteClientAd = (clientId) => {

  return administratorService.deleteClient(clientId);

}

export { handleDeleteClientAd };