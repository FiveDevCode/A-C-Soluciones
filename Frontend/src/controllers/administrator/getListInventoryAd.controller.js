import { administratorService } from "../../services/administrator-service";

const handleGetListInventoryAd = async () => {
  try {
    const res = await administratorService.getListInventory();
    return (res.data || []).slice().reverse();
  } catch (err) {
    throw err;
  }
};

export { handleGetListInventoryAd };
