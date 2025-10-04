

import { technicalService } from "../../services/techical-service";



const handleGetTechnicalId = (id) => {
    
  return technicalService
  .getTechnicalId(id);

};


export {handleGetTechnicalId};