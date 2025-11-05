import { HistorialServicesRepository } from "../repository/Historial_services.repository.js";

export class HistorialServicesService {
  constructor() {
    this.historialServicesRepository = new HistorialServicesRepository();
  }

  async getServiciosByCliente(clienteId) {
    return await this.historialServicesRepository.getHistorialServiciosByCliente(clienteId);
  }
}