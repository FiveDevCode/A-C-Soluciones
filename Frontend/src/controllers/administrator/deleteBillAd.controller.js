import { administratorService } from "../../services/administrator-service"






const handleDeleteBill = (id) => {

  return administratorService.deleteBill(id);


}


export {handleDeleteBill};