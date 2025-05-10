




import { administratorService } from "../../services/administrator-service";

const handleCreateVisit = (estimatedDuration, previousNotes, postnotes, scheduledDate, requestId, technicalId ) => {
    

  return administratorService
  .assignVisit(estimatedDuration, previousNotes, postnotes, scheduledDate, requestId, technicalId );


};


export {handleCreateVisit};