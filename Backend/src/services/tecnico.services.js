import { TecnicoRepository } from '../repository/tecnico.repository.js';

export class TecnicoService {
  constructor() {
    this.tecnicoRepository = new TecnicoRepository();
  }

  async crearTecnico(data) {
    return await this.tecnicoRepository.crearTecnico(data);
  }

  async obtenerTecnicoPorId(id) {
    return await this.tecnicoRepository.obtenerTecnicoPorId(id);
  }

  async obtenerTecnicoPorcedula(numero_de_cedula){
    return await this.tecnicoRepository.obtenerTecnicoPorCedula(numero_de_cedula);
  }

  async obtenerTecnicos() {
    return await this.tecnicoRepository.obtenerTecnicos();
  }

  async actualizarTecnico(id, data) {
    return await this.tecnicoRepository.actualizarTecnico(id, data);
  }

  async eliminarTecnico(id) {
    return await this.tecnicoRepository.eliminarTecnico(id);
  }

  async obtenerPorTecnicoCorreo (correo_electronico){
    return await this.tecnicoRepository.obtenerTecnicoPorCorreo(correo_electronico)
  }
}
