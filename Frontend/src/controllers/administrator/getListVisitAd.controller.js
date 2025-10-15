import { administratorService } from "../../services/administrator-service"



const handleGetListVisitAd = () => {

  return administratorService
  .getListVisit();

}


export {handleGetListVisitAd}