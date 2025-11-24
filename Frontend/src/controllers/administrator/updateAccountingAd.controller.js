import { administratorService } from "../../services/administrator-service";

const handleUpdateAccountingAd = async (id, data) => {
  try {
    return await administratorService.updateAccounting(id, data);
  } catch (error) {
    throw error;
  }
};

export { handleUpdateAccountingAd };
