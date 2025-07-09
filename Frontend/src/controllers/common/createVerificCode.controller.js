import { commonService } from "../../services/common-service"


const handleCreateVerificCode = (email, code) => {

  return commonService
  .createVerificCode(email, code)

}


export {handleCreateVerificCode}