
import { administratorService } from "../../services/administrator-service";

const handleGetListTechnical = () => {
    

  return administratorService
  .getListTechnical();


};


export {handleGetListTechnical};