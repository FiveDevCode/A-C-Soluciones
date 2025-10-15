import { administratorService } from "../../services/administrator-service";

const handleUpdateAccounting = (id, numeroDeCedula, nombre, apellido, correoElectronico, telefono) => {
  return administratorService.updateAccounting(
    id,
    numeroDeCedula,
    nombre,
    apellido,
    correoElectronico,
    telefono
  );
};

export { handleUpdateAccounting };
