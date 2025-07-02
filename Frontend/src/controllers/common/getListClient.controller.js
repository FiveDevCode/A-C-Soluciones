import { commonService } from "../../services/common-service"


const handleGetListClient = () => {

  return commonService
  .getListClient();

}

export {handleGetListClient}