import { accountantService } from "../../services/accountant-service";



const handleGetListBillAc = () => {

  return accountantService.getListBill();

}


export {handleGetListBillAc};