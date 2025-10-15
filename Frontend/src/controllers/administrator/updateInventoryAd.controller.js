import { administratorService } from "../../services/administrator-service"



const handleUpdateInventoryAd = (id, inventoryData) => {
  return administratorService.updateInventory(id, inventoryData);

}


export {handleUpdateInventoryAd};