import { administratorService } from "../../services/administrator-service";





const handleGetAccounting = (id) => {
  return administratorService.getAccounting(id);

}


export {handleGetAccounting};