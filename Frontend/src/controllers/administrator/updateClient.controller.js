


import { administratorService } from "../../services/administrator-service";

const handleUpdateClient = (id, data) => {
    

  return administratorService
  .updateClient(id, data)


};


export {handleUpdateClient};