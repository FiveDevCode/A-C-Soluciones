



import { administratorService } from "../../services/administrator-service";

const handleUpdateServiceAd = (id, nameService, descripcion) => {
    

  return administratorService
  .updateService(id, nameService, descripcion)


};


export {handleUpdateServiceAd};