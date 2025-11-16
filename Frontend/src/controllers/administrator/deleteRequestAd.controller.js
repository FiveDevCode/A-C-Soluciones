import { administratorService } from "../../services/administrator-service"


const handleDeleteRequestAd = (id) => {
  return administratorService.deleteRequest(id);
};

export { handleDeleteRequestAd };