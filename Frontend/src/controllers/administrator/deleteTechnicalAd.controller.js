import { administratorService } from "../../services/administrator-service";




const handleDeleteTechnicalAd = (technicalId) => {
  return administratorService.deleteTechnical(technicalId);

}

export { handleDeleteTechnicalAd };