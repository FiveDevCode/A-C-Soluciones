import { administratorService } from "../../services/administrator-service"


const handleCreateSubmitAccountingAd = (data) => {
  return administratorService.createAccounting(data);
}

export {handleCreateSubmitAccountingAd};