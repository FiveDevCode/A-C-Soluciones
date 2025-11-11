import { administratorService } from "../../services/administrator-service";

const handleUpdateAccountingAd = (id, numeroDeCedula, nombre, apellido, correoElectronico, telefono) => {
  return administratorService.updateAccounting(
    id,
    numeroDeCedula,
    nombre,
    apellido,
    correoElectronico,
    telefono
  );
};

export { handleUpdateAccountingAd };
