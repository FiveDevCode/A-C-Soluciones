// import { ServicioService } from "../services/servicio.services.js";

// export const ServicioController = {
//   crear: async (req, res) => {
//     try {
//       const datos = req.body;
//       const nuevoServicio = await ServicioService.crearServicio(datos);
//       res.status(201).json({
//         ok: true,
//         message: "Servicio creado exitosamente",
//         data: nuevoServicio
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ mensaje: "Error al crear el servicio" });
//     }
//   }, 
 

//   listar: async (req, res) => {
//     try {
//       const servicios = await ServicioService.listarServicios();
//       res.status(200).json(servicios);
//     } catch (error) {
//       res.status(500).json({ mensaje: "Error al obtener los servicios" });
//     }
//   },

//   obtenerPorId: async (req, res) => {
//     try {
//       const id = req.params.id;
//       const servicio = await ServicioService.obtenerServicioPorId(id);

//       if (!servicio) {
//         return res.status(404).json({ mensaje: "Servicio no encontrado" });
//       }

//       res.status(200).json(servicio);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ mensaje: "Error al obtener el servicio" });
//     }
//   },

//   eliminar: async (req, res) => {
//     try {
//       const id = req.params.id;
//       const servicioEliminado = await ServicioService.eliminarServicio(id);

//       if (!servicioEliminado) {
//         return res.status(404).json({ message: "Servicio no encontrado" });
//       }

//       res.status(200).json({ message: "Servicio eliminado satisfactoriamente" });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Error al eliminar el servicio" });
//     }
//   },

//   actualizar: async (req, res) => {
//     try {
//       const id = req.params.id;
//       const datos = req.body;
//       const servicioActualizado = await ServicioService.actualizarServicio(id, datos);

//       if (!servicioActualizado) {
//         return res.status(404).json({ mensaje: "Servicio no encontrado" });
//       }

//       res.status(200).json({
//         mensaje: "Servicio actualizado correctamente",
//         data: servicioActualizado
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ mensaje: "Error al actualizar el servicio" });
//     }
//   }
// };
