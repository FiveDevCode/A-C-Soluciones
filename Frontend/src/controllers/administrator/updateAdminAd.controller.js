


import { administratorService } from "../../services/administrator-service";

const handleUpdateAdmin = (id, IdCard, nameUser, lastName, email) => {
    

  return administratorService
  .updateAdmin(id, IdCard, nameUser, lastName, email)


};


export {handleUpdateAdmin};