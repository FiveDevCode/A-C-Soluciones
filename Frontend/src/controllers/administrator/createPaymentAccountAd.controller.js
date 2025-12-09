import { administratorService } from "../../services/administrator-service";

const handleCreateSubmitPaymentAccount = (data) => {
  return administratorService.createPaymentAccount(data);
};

export { handleCreateSubmitPaymentAccount };
