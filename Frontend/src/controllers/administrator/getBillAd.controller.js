import { administratorService } from "../../services/administrator-service";



const handleGetBillAd = (id) => {
  return administratorService.getBill(id);


}

export {handleGetBillAd};