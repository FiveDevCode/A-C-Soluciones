import { InventarioRepository } from '../repository/inventario.repository.js';


export const INVENTARIO_ERRORS = {
  CODIGO_DUPLICADO: "El código de inventario ya está registrado. Ingrese uno diferente."
};


export class InventarioService {
  constructor() {
    this.inventarioRepository = new InventarioRepository();
  }


// CORRECCIÓN 4: Cambiar el nombre del método
  async crearInventario(data) {
    const inventarioExistente = await this.inventarioRepository.findByCodigo(data.codigo);
    
    if (inventarioExistente) {
      const error = new Error(INVENTARIO_ERRORS.CODIGO_DUPLICADO); 
      error.name = 'CodigoDuplicadoError'; 
      throw error;
    }

    return await this.inventarioRepository.crearHerramienta(data); 
  }


  async obtenerInventarioPorId(id) {
    return await this.inventarioRepository.obtenerHerramientaPorId(id);
  }

  async obtenerTodos() {
    return await this.inventarioRepository.obtenerTodas();
  }
  
  async actualizarInventario(id, data) {
      return await this.inventarioRepository.actualizarHerramienta(id, data);
  }
}