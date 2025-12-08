import { administratorService } from "../../services/administrator-service"

const handleGetListPumpingReportAd = async () => {
  try {
    const res = await administratorService.getListPumpingReports();
    return (res.data || []).slice().reverse();
  } catch (err) {
    throw err;
  }
};


export { handleGetListPumpingReportAd };