import { administratorService } from "../../services/administrator-service";




const handleGetListPaymentAccountAd = () => {

  return administratorService.getListPaymentAccount();

}

export {handleGetListPaymentAccountAd};
