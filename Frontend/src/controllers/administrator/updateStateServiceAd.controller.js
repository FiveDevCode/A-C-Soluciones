


import { administratorService } from "../../services/administrator-service";

const handleChangeStateService = (id, state) => {
    

  return administratorService
  .UpdateStateService(id, state)


};


export {handleChangeStateService};