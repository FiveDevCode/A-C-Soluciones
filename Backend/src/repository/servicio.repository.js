import { ServicioModel } from "../models/servicio.model.js";

const crearServicioRepository = async ({ titulo, descripcion, costo, adicionales }) => {
  if (!titulo || !descripcion || !costo || !adicionales) {
    throw new Error("Faltan campos por completar");
  }

  const nuevoServicio = await ServicioModel.crearServicio(titulo, descripcion, costo, adicionales);
  return nuevoServicio;
};


const obtenerServicioRepository = async () => {
    const servicios = await ServicioModel.consultarServicios();
    return servicios;
    };

const obtenerServicioIDRepository = async (id) => {
    const servicio = await ServicioModel.buscarServicio(id);
    return servicio;
};

const actualizarServicioRepository = async (id, datos) => {
  const { titulo, descripcion, costo, adicionales } = datos;
  const servicioActualizado = await ServicioModel.actualizarServicio(
    id,
    titulo,
    descripcion,
    costo,
    adicionales
  );
  return servicioActualizado;
};

const eliminarServicioRepository = async (id) =>{
   const servicio = await ServicioModel.eliminarServicio(id);
   return servicio
};





export const ServicioRepository = {
    crearServicioRepository,
    obtenerServicioRepository,
    obtenerServicioIDRepository,
    eliminarServicioRepository,
    actualizarServicioRepository

};






