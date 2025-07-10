import { commonService } from "../../services/common-service"



const handleUpdatePassword = (email, code, newPassword) => {

  return commonService
  .updatePassword(email, code, newPassword)

}


export {handleUpdatePassword}