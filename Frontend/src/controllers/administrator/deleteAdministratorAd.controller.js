import { administratorService } from "../../services/administrator-service";





const handleDeleteAdministratorAd = async (administratorId) => {
  return  administratorService.deleteAdministrator(administratorId);

}


export { handleDeleteAdministratorAd };
