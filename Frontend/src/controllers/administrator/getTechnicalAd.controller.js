
import { administratorService } from "../../services/administrator-service";

const handleGetTechical = (id) => {
    
  return administratorService
  .getTechnical(id)

};


export {handleGetTechical};