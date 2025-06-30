import { administratorService } from "../../services/administrator-service"



const handleGetVisit = (id_visit) => {

  return administratorService
  .getVisit(id_visit)

}


export {handleGetVisit}