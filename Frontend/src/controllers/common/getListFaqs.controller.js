import { commonService } from "../../services/common-service"




const handleGetListFaqs = () => {

  return commonService
  .getListFaqs();

}


export {handleGetListFaqs}