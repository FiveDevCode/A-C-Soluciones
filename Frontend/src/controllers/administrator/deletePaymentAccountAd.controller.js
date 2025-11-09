import { administratorService } from "../../services/administrator-service"





const handleDeletePaymentAccount = (id) => {

  return administratorService.deleteAccount(id);
}

export {handleDeletePaymentAccount};