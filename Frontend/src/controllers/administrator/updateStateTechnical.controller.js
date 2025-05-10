


import { administratorService } from "../../services/administrator-service";

const handleChangeStateTechnical = (id, state) => {
    

  return administratorService
  .stateChange(id, state)


};


export {handleChangeStateTechnical};