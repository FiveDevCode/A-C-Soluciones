import { administratorService } from "../../services/administrator-service";

const handleGetListInventoryAd = () => {
  return administratorService.getListInventory();
};

export { handleGetListInventoryAd };
