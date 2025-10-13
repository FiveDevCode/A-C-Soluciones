import { administratorService } from "../../services/administrator-service";




const handleChangeStateBill = (id, state) => {
  return administratorService.updateStateBill(id, state);
}

export {handleChangeStateBill};