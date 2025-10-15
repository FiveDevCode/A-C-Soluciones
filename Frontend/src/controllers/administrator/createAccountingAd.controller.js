import { administratorService } from "../../services/administrator-service"


const handleCreateSubmitAccounting = (
  numero_de_cedula,
  nombre,
  apellido,
  correo_electronico,
  telefono,
  contrasenia
) => {
  return administratorService.createAccounting(  
    numero_de_cedula,
    nombre,
    apellido,
    correo_electronico,
    telefono,
    contrasenia
  );
}

export {handleCreateSubmitAccounting};