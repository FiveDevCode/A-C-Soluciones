import { administratorService } from "../../services/administrator-service"




const handleChangeStateAccounting = (id) => {
   return administratorService.updateStateAccounting(id);
}

export {handleChangeStateAccounting};