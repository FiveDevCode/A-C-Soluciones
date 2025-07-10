import { administratorService } from "../../services/administrator-service"






const handleUpdateStateRequest = (id, state) => {

  return administratorService
  .updateStateRequest(id, state)


}

export {handleUpdateStateRequest}