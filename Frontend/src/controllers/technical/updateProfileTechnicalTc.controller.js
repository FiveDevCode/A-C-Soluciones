import { technicalService } from "../../services/techical-service"



const handleUpdateProfileTechnical = (id, nameUser, lastName, phone, email) => {


  return technicalService
  .updateProfileTechnical(id, nameUser, lastName, phone, email);

}

export {handleUpdateProfileTechnical}