import { technicalService } from "../../services/techical-service";



const handleGetVisitAssign= (id) => {
    
  return technicalService
  .getServiceAssign(id);

};


export {handleGetVisitAssign};