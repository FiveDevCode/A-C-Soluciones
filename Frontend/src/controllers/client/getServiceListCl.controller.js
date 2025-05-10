




import { clientService } from "../../services/client-service";

const handleGetServiceList = () => {
    

  return clientService
  .getServiceList();


};


export {handleGetServiceList};