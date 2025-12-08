import { accountantService } from "../../services/accountant-service";

const handleGetAccountingAc = (id) => {
  return accountantService.getAccounting(id);
}

export { handleGetAccountingAc };
