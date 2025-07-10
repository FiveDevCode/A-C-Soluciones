


import { administratorService } from "../../services/administrator-service";

const handleGetClient = (id) => {
    
  return administratorService
  .getClient(id)

};


export {handleGetClient};