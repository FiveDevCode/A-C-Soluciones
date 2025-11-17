import { HistorialServicesService } from "../services/Historial_services.services.js";

export class HistorialServicesController {
  constructor() {
    this.historialServicesService = new HistorialServicesService();
  }

  getServiciosByCliente = async (req, res) => {
    try {
      const clienteId = req.params.clienteId;
      const servicios = await this.historialServicesService.getServiciosByCliente(clienteId);
      res.json({ success: true, data: servicios });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
