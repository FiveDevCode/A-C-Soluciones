
import { administratorService } from "../../services/administrator-service";


const handleGetAdminId = (id) => {
    
  return administratorService
  .getAdminId(id);

};


export {handleGetAdminId};