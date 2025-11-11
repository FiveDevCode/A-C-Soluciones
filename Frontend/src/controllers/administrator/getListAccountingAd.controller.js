import { administratorService } from "../../services/administrator-service";

const handleGetListAccountingAd = async () => {
  try {
    const res = await administratorService.getListAccounting();
    return (res.data.contabilidad || []).slice().reverse();
  } catch (err) {
    throw err;
  }
};

export { handleGetListAccountingAd };