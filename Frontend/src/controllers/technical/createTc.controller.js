import { technicalService } from "../../services/techical-service";

const handleCreateSubmitTechnical = (IdCard, name, lastName, email, phone, password, position) => {
    

    technicalService
    .createTechnical(IdCard, name, lastName, email, phone, password, position)


};


export {handleCreateSubmitTechnical};