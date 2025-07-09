import { commonService } from "../../services/common-service"




const handleGetListToken = () => {

  return commonService
  .getListToken();

}


export {handleGetListToken}