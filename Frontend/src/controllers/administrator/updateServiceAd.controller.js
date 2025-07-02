



import { administratorService } from "../../services/administrator-service";

const handleUpdateService = (id, nameService, descripcion) => {
    

  return administratorService
  .updateService(id, nameService, descripcion)


};


export {handleUpdateService};