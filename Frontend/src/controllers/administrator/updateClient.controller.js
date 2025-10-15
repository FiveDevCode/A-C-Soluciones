


import { administratorService } from "../../services/administrator-service";

const handleUpdateClient = (id, IdCard, name, lastName, email, phone, address) => {
    

  return administratorService
  .updateClient(id, IdCard, name, lastName, email, phone, address)


};


export {handleUpdateClient};