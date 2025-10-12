import { InventarioModel } from '../models/inventario.model.js';

export class InventarioRepository {


  async findByCodigo(codigo) {
    return await InventarioModel.Inventario.findOne({
      where: { codigo: codigo },
    });

  }


  async crearHerramienta(data) {
    return await InventarioModel.Inventario.create(data);
  }


  async obtenerHerramientaPorId(id) {
    return await InventarioModel.Inventario.findByPk(id);
  }

  async obtenerTodas() {
    return await InventarioModel.Inventario.findAll();
  }


  async actualizarHerramienta(id, data) {
    const inventario = await this.obtenerHerramientaPorId(id);
    if (!inventario) return null;
    
    await inventario.update(data);
    return inventario;
  }
}