

import { administratorService } from "../../services/administrator-service";

const handleCreateService = (nameService, description) => {
    

  return administratorService
  .createService(nameService, description);


};


export {handleCreateService};