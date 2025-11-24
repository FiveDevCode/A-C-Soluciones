import { administratorService } from "../../services/administrator-service";




const handleDeleteServiceAd = (serviceId) => {

  return administratorService.deleteService(serviceId);


};


export { handleDeleteServiceAd };