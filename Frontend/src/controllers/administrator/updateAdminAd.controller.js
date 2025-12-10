


import { administratorService } from "../../services/administrator-service";

const handleUpdateAdmin = (id, IdCard, nameUser, lastName, telefono, email, state) => {
    

  return administratorService
  .updateAdmin(id, IdCard, nameUser, lastName, telefono, email, state)


};


export {handleUpdateAdmin};