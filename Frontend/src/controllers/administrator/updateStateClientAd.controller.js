


import { administratorService } from "../../services/administrator-service";

const handleChangeStateClient = (id, state) => {
    

  return administratorService
  .UpdateStateClient(id, state)


};


export {handleChangeStateClient};