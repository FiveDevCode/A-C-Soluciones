



import { administratorService } from "../../services/administrator-service";

const handleUpdateTechnical = (id, data) => {
    

  return administratorService
  .updateTechnical(id, data)


};


export {handleUpdateTechnical};