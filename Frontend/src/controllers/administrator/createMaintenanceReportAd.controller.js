import { administratorService } from "../../services/administrator-service";


const handleCreateMaintenanceReportAd  = (data) => {
  return administratorService.createMaintenanceReport(data);

};

export { handleCreateMaintenanceReportAd };