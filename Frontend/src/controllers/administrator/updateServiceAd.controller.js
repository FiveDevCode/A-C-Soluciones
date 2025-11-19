



import { administratorService } from "../../services/administrator-service";

const handleUpdateServiceAd = (id, data) => {
    

  return administratorService
  .updateService(id, data)


};


export {handleUpdateServiceAd};