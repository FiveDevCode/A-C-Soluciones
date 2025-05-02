import { technicalService } from "../../services/techical-service";

const handleCreateSubmitTechnical = (IdCard, name, lastName, email, phone, password, position, event) => {
    

    technicalService
    .createTechnical(IdCard, name, lastName, email, phone, password, position)
    .then(() => {
        console.log("Creado con exito!!!");
        //window.location.href = "/screens/registro_completado.html";
    })
    .catch(err =>console.log("Error al realizar la solicitud:", err));

};


export {handleCreateSubmitTechnical};