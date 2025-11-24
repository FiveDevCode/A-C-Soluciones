import { administratorService } from "../../services/administrator-service";



const handleGetListMaintenanceReportAd = async() => {
  try {
    const res = await administratorService.getListMaintenanceReport();
    return (res.data.reportes || []).slice().reverse();
  } catch (err) {
    throw err;
  }
  
};

export { handleGetListMaintenanceReportAd };