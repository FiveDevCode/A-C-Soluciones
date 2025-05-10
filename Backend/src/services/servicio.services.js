import { ServicioRepository } from '../repository/servicio.repository.js';
import { VisitaRepository } from '../repository/visita.repository.js';
export class ServicioService {
  constructor() {
    this.servicioRepository = new ServicioRepository();
  }

  async crearServicio(data) {
    return await this.servicioRepository.crearServicio(data);
  }

  async obtenerServicioPorId(id) {
    return await this.servicioRepository.obtenerServicioPorId(id);
  }

  async obtenerServicioPorNombre(nombre) {
    return await this.servicioRepository.obtenerServicioPorNombre(nombre);
  }

  async buscarServicios(termino) {
    return await this.servicioRepository.buscarServicios(termino);
  }

  async obtenerServicios() {
    return await this.servicioRepository.obtenerServicios();
  }

  async obtenerServiciosActivos() {
    return await this.servicioRepository.obtenerServiciosActivos();
  }

  async actualizarServicio(id, data) {
    return await this.servicioRepository.actualizarServicio(id, data);
  }

  async eliminarServicio(id) {
    return await this.servicioRepository.eliminarServicio(id);
  }

  async deshabilitarServicio(id) {
    return await this.servicioRepository.deshabilitarServicio(id);
  }

  async habilitarServicio(id) {
    return await this.servicioRepository.habilitarServicio(id);
  }
  async obtenerServiciosPorTecnico(tecnico_id) {
    return await this.servicioRepository.obtenerServiciosPorTecnico(tecnico_id);
  }

}