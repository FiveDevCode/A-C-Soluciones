import { administratorService } from "../../services/administrator-service"

const handleUpdatePaymentAccountAd = (id, paymentAccountData) => {
  return administratorService.updatePaymentAccount(id, paymentAccountData);

}

export {handleUpdatePaymentAccountAd};