import { commonService } from "../../services/common-service";



const handleUpdateStateVisit = (id_visit, state) => {

  return commonService
  .updateStateVisit(id_visit, state)

}

export {handleUpdateStateVisit};