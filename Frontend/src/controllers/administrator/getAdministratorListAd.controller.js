



import { administratorService } from "../../services/administrator-service";

const handleGetListAdministrator = () => {
    
  return administratorService
  .getListAdministrator()

};


export {handleGetListAdministrator};