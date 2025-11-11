import { ContabilidadModel } from "../models/contabilidad.model.js";

export class ContabilidadRepository {
  async crearContabilidad(data) {
    return await ContabilidadModel.Contabilidad.create(data);
  }

  async obtenerContabilidadPorId(id) {
    return await ContabilidadModel.Contabilidad.findByPk(id);
  }
  async obtenerContabilidadPorCedula(numero_de_cedula) {
    return await ContabilidadModel.Contabilidad.findOne({
      where: { numero_de_cedula },
    });
  }
  async obtenerContabilidadPorCorreo(correo_electronico) {
    return await ContabilidadModel.Contabilidad.findOne({
      where: { correo_electronico },
    });
  }
  async obtenerContabilidads() {
    return await ContabilidadModel.Contabilidad.findAll();
  }

  async actualizarContabilidad(id, data) {
    const contabilidad = await ContabilidadModel.Contabilidad.findByPk(id);
    if (!contabilidad) return null;
    
    // Limpia y normaliza los datos antes de actualizar
    const datosLimpios = {};
    
    // Procesa cada campo y asegura que sean del tipo correcto
    for (const [key, value] of Object.entries(data)) {
      // Si el valor es null o undefined, lo omite
      if (value == null) continue;
      
      // Si es un objeto (no debería serlo), intenta extraer el valor
      if (typeof value === 'object' && !Array.isArray(value)) {
        console.warn(`⚠️ Campo ${key} es un objeto:`, value);
        datosLimpios[key] = String(value.value || value[key] || '');
      } else {
        // Asegura que sea string para campos de texto
        datosLimpios[key] = String(value);
      }
    }
    
    console.log('✅ Datos limpios para update:', datosLimpios);
    
    // Usa el método update con los datos limpios
    return await contabilidad.update(datosLimpios);
  }
  

  async eliminarContabilidad(id) {
    const contabilidad = await ContabilidadModel.Contabilidad.findByPk(id);
    if (!contabilidad) return null;
    if (contabilidad.estado) {
      contabilidad.estado = "inactivo";
      await contabilidad.save();
    } else {
      await contabilidad.destroy();
    }
    return contabilidad;
  }
}
