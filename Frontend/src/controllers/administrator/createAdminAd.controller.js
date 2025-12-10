import { administratorService } from "../../services/administrator-service"



const handleCreateAdmin = (idCard, name, lastName, telefono, email, password) => {

  return administratorService
  .createAdmin(idCard, name, lastName, telefono, email, password)


}


export {handleCreateAdmin}