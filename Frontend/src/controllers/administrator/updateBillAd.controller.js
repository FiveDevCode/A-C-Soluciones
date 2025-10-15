import { administratorService } from "../../services/administrator-service"

const handleUpdateBill = (id, formData) => {
  return administratorService.updateBill(id, formData);

}

export {handleUpdateBill};