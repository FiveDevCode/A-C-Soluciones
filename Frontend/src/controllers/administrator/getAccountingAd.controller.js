import { administratorService } from "../../services/administrator-service";





const handleGetAccountingAd = (id) => {
  return administratorService.getAccounting(id);

}


export {handleGetAccountingAd};