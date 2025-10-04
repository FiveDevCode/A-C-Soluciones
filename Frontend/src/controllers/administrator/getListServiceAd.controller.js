

import { administratorService } from "../../services/administrator-service";

const handleGetListServiceAd = () => {
    
  return administratorService
  .getServiceList()

};


export {handleGetListServiceAd};