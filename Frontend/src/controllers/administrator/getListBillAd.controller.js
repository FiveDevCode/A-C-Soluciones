import { administratorService } from "../../services/administrator-service"



const handleGetListBillAd = () => {

  return administratorService.getListBill();

}


export {handleGetListBillAd};