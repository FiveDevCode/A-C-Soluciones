


import { technicalService } from "../../services/techical-service";



const handleGetServiceList= () => {
    
  return technicalService
  .getListVisits();

};


export {handleGetServiceList};