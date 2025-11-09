import { administratorService } from "../../services/administrator-service";



const handleGetPaymentAccountAd = (id) => {

  return administratorService.getPaymentAccount(id);

}

export {handleGetPaymentAccountAd};