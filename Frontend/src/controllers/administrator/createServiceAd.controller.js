

import { administratorService } from "../../services/administrator-service";

const handleCreateService = (data) => {
    

  return administratorService
  .createService(data);


};


export {handleCreateService};