import { technicalService } from "../../services/techical-service";



const handleGetServiceAssign= (id) => {
    
  return technicalService
  .getServiceAssign(id);

};


export {handleGetServiceAssign};