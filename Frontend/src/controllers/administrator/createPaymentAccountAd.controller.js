import { administratorService } from "../../services/administrator-service";

const handleCreateSubmitPaymentAccount = (
  numeroCuenta,
  fechaRegistro,
  idCliente,
  idAdministrador,
  nit
) => {
  // Armar el objeto en snake_case antes de enviarlo al servicio
  const paymentAccountData = {
    numero_cuenta: numeroCuenta,
    fecha_registro: fechaRegistro,
    id_cliente: idCliente,
    id_administrador: idAdministrador,
    nit: nit,
  };

  return administratorService.createPaymentAccount(paymentAccountData);
};

export { handleCreateSubmitPaymentAccount };
