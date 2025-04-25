import { ServicioRepository } from "../repository/servicio.repository.js";

export const ServicioService = {
  crearServicio: async (datos) => {
    return await ServicioRepository.crearServicioRepository(datos);
  },

  listarServicios: async () => {
    return await ServicioRepository.obtenerServicioRepository();
  },

  obtenerServicioPorId: async (id) => {
    return await ServicioRepository.obtenerServicioIDRepository(id);
  },

  eliminarServicio: async (id) => {
    return await ServicioRepository.eliminarServicioRepository(id);
  },

  actualizarServicio: async (id, datos) => {
    return await ServicioRepository.actualizarServicioRepository(id, datos);
  }
};
