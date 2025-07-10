




import { administratorService } from "../../services/administrator-service";

const handleCreateVisit = (estimatedDuration, previousNotes, postnotes, scheduledDate, requestId, technicalId, serviceId ) => {
    

  return administratorService
  .assignVisit(estimatedDuration, previousNotes, postnotes, scheduledDate, requestId, technicalId, serviceId );


};


export {handleCreateVisit};