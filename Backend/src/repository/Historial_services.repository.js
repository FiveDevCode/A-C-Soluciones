import { sequelize } from '../database/conexion.js';

export class HistorialServicesRepository {
  async getHistorialServiciosByCliente(clienteId) {
    try {
      // Obtener historial de visitas (clientes regulares)
      const historialVisitas = await sequelize.query(`
        SELECT 
            v.fecha_programada AS fecha,
            s.nombre AS servicio,
            CONCAT(t.nombre, ' ', t.apellido) AS tecnico,
            v.estado,
            v.id AS visita_id,
            f.pdf_path
        FROM visitas v
        INNER JOIN solicitudes so ON v.solicitud_id_fk = so.id
        INNER JOIN servicios s ON v.servicio_id_fk = s.id
        INNER JOIN tecnico t ON v.tecnico_id_fk = t.id
        LEFT JOIN ficha_de_mantenimiento f ON f.id_visitas = v.id
        WHERE so.cliente_id_fk = :clienteId
        ORDER BY v.fecha_programada DESC
      `, {
        replacements: { clienteId },
        type: sequelize.QueryTypes.SELECT
      });

      // Obtener fichas de clientes fijos (sin visitas)
      const fichasFijas = await sequelize.query(`
        SELECT 
            f.fecha_de_mantenimiento AS fecha,
            'Servicio de Mantenimiento' AS servicio,
            CONCAT(t.nombre, ' ', t.apellido) AS tecnico,
            'completada' AS estado,
            NULL AS visita_id,
            f.pdf_path
        FROM ficha_de_mantenimiento f
        INNER JOIN tecnico t ON f.id_tecnico = t.id
        WHERE f.id_cliente = :clienteId
          AND f.id_visitas IS NULL
        ORDER BY f.fecha_de_mantenimiento DESC
      `, {
        replacements: { clienteId },
        type: sequelize.QueryTypes.SELECT
      });

      // Combinar ambos resultados
      const historialCompleto = [...historialVisitas, ...fichasFijas];

      const historialFormateado = historialCompleto.map(item => ({
        ...item,
        fecha: item.fecha ? new Date(item.fecha).toISOString() : null
      }));

      // Ordenar por fecha descendente
      historialFormateado.sort((a, b) => {
        const dateA = a.fecha ? new Date(a.fecha) : new Date(0);
        const dateB = b.fecha ? new Date(b.fecha) : new Date(0);
        return dateB - dateA;
      });

      return historialFormateado;
    } catch (error) {
      console.error('Error al obtener el historial de servicios:', error);
      throw error;
    }
  }
}
