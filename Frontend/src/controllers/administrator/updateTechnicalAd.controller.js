



import { administratorService } from "../../services/administrator-service";

const handleUpdateTechnical = (id, idCard, nameUser, lastName, email, phone, position) => {
    

  return administratorService
  .updateTechnical(id, idCard, nameUser, lastName, email, phone, position)


};


export {handleUpdateTechnical};