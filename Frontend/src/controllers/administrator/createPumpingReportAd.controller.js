import { administratorService } from "../../services/administrator-service"





const handleCreatePumpingReportAd = (data) => { 

  return administratorService.createPumpingReport(data);

};


export { handleCreatePumpingReportAd };