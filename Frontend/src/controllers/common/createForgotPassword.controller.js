import { commonService } from "../../services/common-service"



const handleCreateForgotPassword = (email) => {

  return commonService
  .createForgotPassword(email);

}


export {handleCreateForgotPassword}