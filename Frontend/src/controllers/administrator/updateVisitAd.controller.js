import { administratorService } from "../../services/administrator-service"




const handleUpdateVisitAd = (id, visitData) => {
  return administratorService.updateVisit(id, visitData);
};

export { handleUpdateVisitAd };