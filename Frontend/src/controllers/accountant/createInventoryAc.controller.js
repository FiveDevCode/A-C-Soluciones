import { accountantService } from "../../services/accountant-service"


const handleCreateInventory = (inventoryData) => {

  return accountantService.createInventory(inventoryData);
}

export {handleCreateInventory};