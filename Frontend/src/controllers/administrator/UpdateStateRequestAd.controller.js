import { administratorService } from "../../services/administrator-service"

const handleUpdateStateRequest = (id, state, motivoCancelacion = null) => {
  return administratorService.updateStateRequest(id, state, motivoCancelacion);
}

export {handleUpdateStateRequest}