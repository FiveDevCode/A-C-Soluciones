import { administratorService } from "../../services/administrator-service"



const handleGetListReportAd = () => {
  return administratorService.getListReport();

}

export { handleGetListReportAd };