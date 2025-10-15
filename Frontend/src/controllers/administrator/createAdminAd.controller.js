import { administratorService } from "../../services/administrator-service"



const handleCreateAdmin = (idCard, name, lastName, email, password) => {

  return administratorService
  .createAdmin(idCard, name, lastName, email, password)


}


export {handleCreateAdmin}