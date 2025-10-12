import { administratorService } from "../../services/administrator-service";




const handleGetListAccounting = () => {
  return administratorService.getListAccounting();
}


export {handleGetListAccounting};