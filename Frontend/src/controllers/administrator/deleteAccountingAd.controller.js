import { administratorService } from "../../services/administrator-service";





const handleDeleteAccountingAd = (id) => {
  return administratorService.deleteAccounting(id);
} 

export { handleDeleteAccountingAd };