import { administratorService } from "../../services/administrator-service"





const handleGetInventoryAd = (id) => {

  return administratorService.getInventory(id);


}


export {handleGetInventoryAd};