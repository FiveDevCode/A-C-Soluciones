import { administratorService } from "../../services/administrator-service"





const handleUpdateStateAdministrator = (id, state) =>{

  return administratorService
  .updateStateAdministrator(id, state)


}


export {handleUpdateStateAdministrator}