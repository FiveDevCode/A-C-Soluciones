import { administratorService } from "../../services/administrator-service";

const handleCreateSubmitTechnical = (IdCard, name, lastName, email, phone, password, position) => {
    

    return administratorService
    .createTechnical(IdCard, name, lastName, email, phone, password, position)


};


export {handleCreateSubmitTechnical};