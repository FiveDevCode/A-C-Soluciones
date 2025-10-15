
import { commonService } from "../../services/common-service";

const handleCreateMaintenanceSheet = (data) => 
{
    
  return commonService
  .createMaintenanceSheet(data);


};


export {handleCreateMaintenanceSheet};