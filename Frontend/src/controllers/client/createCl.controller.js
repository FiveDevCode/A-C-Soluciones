
import { clientService } from "../../services/client-service";

const handleCreateSubmitClient = (IdCard, name, lastName, email, phone, password, address) => {
    

    return clientService
    .createClient(IdCard, name, lastName, email, phone, password, address)


};


export {handleCreateSubmitClient};