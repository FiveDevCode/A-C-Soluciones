import { administratorService } from "../../services/administrator-service"


const handleDeleteInventory = (id) => {
  return administratorService.deleteInventory(id);

}

export { handleDeleteInventory };