import { pool } from "../database/conexion.js";


const crearServicio = async (titulo, descripcion,costo,adicionales ) => {
   const query = {
    text: `INSERT INTO servicio (titulo, descripcion, costo, adicionales)
    VALUES ($1, $2, $3, $4) RETURNING *`,
    values: [titulo, descripcion, costo, adicionales]
   }

   const { rows } = await pool.query(query);
   return rows[0];
}


// consultar todos los servicios que estan en la base de datos 
const consultarServicios = async () => {
    const query = { text: `SELECT * FROM servicio`}
    const { rows } = await pool.query(query);
    return rows;
    }
    
// buscar un servicio por id
const buscarServicio = async (id) => {
    const query = { text: `SELECT * FROM servicio WHERE id = $1`,
          values: [id] 
        }
        const { rows } = await pool.query(query);
        return rows[0];
}

// actualizar servicios 
const actualizarServicio = async (id, titulo, descripcion, costo, adicionales) => {
    const query = {
      text: `
        UPDATE servicio 
        SET titulo = $1, descripcion = $2, costo = $3, adicionales = $4 
        WHERE id = $5 
        RETURNING *`,
      values: [titulo, descripcion, costo, adicionales, id],
    };
  
    const { rows } = await pool.query(query);
    return rows[0]; // Devuelve el servicio actualizado
  };
  


// eliminar un servicio 
const eliminarServicio = async (id) => {
    const query = {
      text: `DELETE FROM servicio WHERE id = $1 RETURNING *`,
      values: [id],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  };



export const ServicioModel = {
    crearServicio,
    consultarServicios,
    buscarServicio,
    eliminarServicio,
    actualizarServicio

    };