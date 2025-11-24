


import { administratorService } from "../../services/administrator-service";

const handleUpdateAdmin = (id, IdCard, nameUser, lastName, email, state) => {
    

  return administratorService
  .updateAdmin(id, IdCard, nameUser, lastName, email, state)


};


export {handleUpdateAdmin};