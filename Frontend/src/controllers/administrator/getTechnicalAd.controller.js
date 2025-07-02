
import { administratorService } from "../../services/administrator-service";

const handleGetTechnical = (id) => {
    
  return administratorService
  .getTechnical(id)

};


export {handleGetTechnical};