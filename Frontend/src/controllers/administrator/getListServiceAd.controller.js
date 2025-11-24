import { administratorService } from "../../services/administrator-service";

const handleGetListServiceAd = async () => {
  try {
    const res = await administratorService.getServiceList();
    return (res.data.data || []).slice().reverse();
  } catch (err) {
    throw err;
  }
};

export { handleGetListServiceAd };
