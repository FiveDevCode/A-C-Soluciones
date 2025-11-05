import { clientService } from "../../services/client-service";

const handleGetHistoryServiceByCliente = (clienteId) => {
  return clientService.getHistorialServiciosByCliente(clienteId);
};
export { handleGetHistoryServiceByCliente };