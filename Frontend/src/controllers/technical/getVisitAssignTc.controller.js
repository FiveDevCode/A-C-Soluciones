import { technicalService } from "../../services/techical-service";



const handleGetVisitAssign = (id) => {
    
  return technicalService
  .getServiceAssign(id);

};

const handleGetAllVisitsAssign = () => {
  return technicalService.getListVisits();
};


export { handleGetVisitAssign, handleGetAllVisitsAssign };