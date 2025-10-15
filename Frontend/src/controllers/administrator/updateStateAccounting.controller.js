import { administratorService } from "../../services/administrator-service"




const handleChangeStateAccounting = (id, state) => {
   return administratorService.updateStateAccounting(id, state);
}

export {handleChangeStateAccounting};