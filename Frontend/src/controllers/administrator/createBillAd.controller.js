import { administratorService } from "../../services/administrator-service"



const handleCreateBill = (billData) => {
  return administratorService.createBill(billData);

}

export {handleCreateBill};