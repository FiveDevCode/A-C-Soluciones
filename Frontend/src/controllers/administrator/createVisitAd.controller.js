




import { administratorService } from "../../services/administrator-service";

const handleCreateVisit = (estimatedDuration, previousNotes, postnotes, requestId, technicalId ) => {
    

  return administratorService
  .assignVisit(estimatedDuration, previousNotes, postnotes, requestId, technicalId );


};


export {handleCreateVisit};