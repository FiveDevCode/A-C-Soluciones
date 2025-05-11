import { administratorService } from "../../services/administrator-service";

const handleGetService = (id) => {
    
  return administratorService
  .getService(id)

};


export {handleGetService};