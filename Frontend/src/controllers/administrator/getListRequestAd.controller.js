
import { administratorService } from "../../services/administrator-service";

const handleGetListRequest = () => {
    
  return administratorService
  .getListRequest()

};


export {handleGetListRequest};