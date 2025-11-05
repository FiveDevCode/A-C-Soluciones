import { sequelize } from '../database/conexion.js';

export class HistorialServicesRepository {
  async getHistorialServiciosByCliente(clienteId) {
    try {
      const historial = await sequelize.query(`
        SELECT 
            v.fecha_programada AS fecha,
            s.nombre AS servicio,
            CONCAT(t.nombre, ' ', t.apellido) AS tecnico,
            v.estado
        FROM visitas v
        INNER JOIN solicitudes so ON v.solicitud_id_fk = so.id
        INNER JOIN servicios s ON v.servicio_id_fk = s.id
        INNER JOIN tecnico t ON v.tecnico_id_fk = t.id
        WHERE so.cliente_id_fk = :clienteId
        ORDER BY v.fecha_programada DESC
      `, {
        replacements: { clienteId },
        type: sequelize.QueryTypes.SELECT
      });

      const historialFormateado = historial.map(item => ({
        ...item,
        fecha: new Date(item.fecha).toLocaleString('es-CO', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      }));

      return historialFormateado;
    } catch (error) {
      console.error('Error al obtener el historial de servicios:', error);
      throw error;
    }
  }
}
