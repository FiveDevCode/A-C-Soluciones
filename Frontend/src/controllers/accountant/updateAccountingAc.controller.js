import { accountantService } from "../../services/accountant-service";

const handleUpdateAccountingAc = async (id, data) => {
  try {
    return await accountantService.updateAccounting(id, data);
  } catch (error) {
    throw error;
  }
};

export { handleUpdateAccountingAc };
