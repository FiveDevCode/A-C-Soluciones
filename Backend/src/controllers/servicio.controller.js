// src/controllers/servicio.controller.js
import { ServicioService } from '../services/servicio.services.js';
import { ValidationError } from 'sequelize';

export class ServicioController {
  constructor() {
    this.servicioService = new ServicioService();
  }

  // Crear un  servicio
  crearServicio = async (req, res) => {
    try {
      const { nombre } = req.body;
      
      // Verificar si ya existe un servicio con ese nombre
      const servicioExistente = await this.servicioService.obtenerServicioPorNombre(nombre);
      
      if (servicioExistente) {
        return res.status(400).json({ 
          success: false,
          message: 'Ya existe un servicio con ese nombre.' 
        });
      }
      
      // Agregar el ID del administrador desde el token
      const dataServicio = {
        ...req.body,
        creada_por_fk: req.user.id,
        id_administrador: req.user.id
      };
      
      // Crear el servicio
      const nuevoServicio = await this.servicioService.crearServicio(dataServicio);
      
      return res.status(201).json({
        success: true,
        message: 'Servicio creado correctamente',
        data: nuevoServicio
      });
      
    } catch (error) {
      console.error('Error al crear servicio:', error);
      
      if (error instanceof ValidationError) {
        const mensajes = error.errors.map((err) => err.message);
        return res.status(400).json({ 
          success: false,
          errors: mensajes 
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: 'Error al crear el servicio.' 
      });
    }
  };

  // Obtener un servicio por su ID
  obtenerServicioPorId = async (req, res) => {
    try {
      const servicio = await this.servicioService.obtenerServicioPorId(req.params.id);
      
      if (!servicio) {
        return res.status(404).json({ 
          success: false,
          message: 'Servicio no encontrado.' 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: servicio
      });
      
    } catch (error) {
      console.error('Error al obtener servicio por ID:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error al obtener el servicio.' 
      });
    }
  };

  // Obtener un servicio por su nombre
  obtenerServicioPorNombre = async (req, res) => {
    try {
      const { nombre } = req.params;
      const servicio = await this.servicioService.obtenerServicioPorNombre(nombre);
      
      if (!servicio) {
        return res.status(404).json({ 
          success: false,
          message: 'Servicio no encontrado.' 
        });
      }
      
      return res.status(200).json({
        success: true,
        data: servicio
      });
      
    } catch (error) {
      console.error('Error al obtener servicio por nombre:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error al obtener el servicio.' 
      });
    }
  };

  // Buscar servicios por término
  buscarServicios = async (req, res) => {
    try {
      const { termino } = req.query;
      
      if (!termino || termino.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'El término de búsqueda es requerido'
        });
      }
      
      const servicios = await this.servicioService.buscarServicios(termino);
      
      return res.status(200).json({
        success: true,
        count: servicios.length,
        data: servicios
      });
      
    } catch (error) {
      console.error('Error al buscar servicios:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error al buscar servicios.' 
      });
    }
  };

  // Obtener todos los servicios
  obtenerServicios = async (req, res) => {
    try {
      const servicios = await this.servicioService.obtenerServicios();
      
      return res.status(200).json({
        success: true,
        count: servicios.length,
        data: servicios
      });
      
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error al obtener los servicios.' 
      });
    }
  };

  // Obtener servicios activos
  obtenerServiciosActivos = async (req, res) => {
    try {
      const servicios = await this.servicioService.obtenerServiciosActivos();
      
      return res.status(200).json({
        success: true,
        count: servicios.length,
        data: servicios
      });
      
    } catch (error) {
      console.error('Error al obtener servicios activos:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error al obtener los servicios activos.' 
      });
    }
  };

  // Actualizar un servicio existente
  actualizarServicio = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si existe el servicio
      const servicio = await this.servicioService.obtenerServicioPorId(id);
      
      if (!servicio) {
        return res.status(404).json({ 
          success: false,
          message: 'Servicio no encontrado.' 
        });
      }
      
      // Si se va a cambiar el nombre, pues se verfiica que no exista otro con ese nombre
      if (req.body.nombre && req.body.nombre !== servicio.nombre) {
        const servicioConNombre = await this.servicioService.obtenerServicioPorNombre(req.body.nombre);
        
        if (servicioConNombre && servicioConNombre.id !== parseInt(id)) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe otro servicio con ese nombre.'
          });
        }
      }
      
      // Actualizar el servicio
      const servicioActualizado = await this.servicioService.actualizarServicio(id, {
        ...req.body,
        fecha_modificacion: new Date(),
        id_administrador: req.user.id // El administrador que hace la modificación
      });
      
      return res.status(200).json({
        success: true,
        message: 'Servicio actualizado correctamente',
        data: servicioActualizado
      });
      
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      
      if (error instanceof ValidationError) { 
        const fieldErrors = {}; 
        error.errors.forEach((err) => { 
          if (err.path) { 
            fieldErrors[err.path] = err.message; 
          } 
        }); 
        return res.status(400).json({ errors: fieldErrors }); 
      } 

      return res.status(500).json({ 
        success: false,
        message: 'Error al actualizar el servicio.' 
      });
    }
  };

  // Eliminar un servicio
  eliminarServicio = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.servicioService.eliminarServicio(id);
      
      if (!resultado) {
        return res.status(404).json({ 
          success: false,
          message: 'Servicio no encontrado.' 
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Servicio eliminado correctamente.'
      });
      
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error al eliminar el servicio.' 
      });
    }
  };

  // Deshabilitar un servicio (cambiar estado a inactivo)
  deshabilitarServicio = async (req, res) => {
    try {
      const { id } = req.params;
      const servicio = await this.servicioService.deshabilitarServicio(id);
      
      if (!servicio) {
        return res.status(404).json({ 
          success: false,
          message: 'Servicio no encontrado.' 
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Servicio deshabilitado correctamente.',
        data: servicio
      });
      
    } catch (error) {
      console.error('Error al deshabilitar servicio:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error al deshabilitar el servicio.' 
      });
    }
  };

  // Habilitar un servicio (cambiar estado a activo)
  habilitarServicio = async (req, res) => {
    try {
      const { id } = req.params;
      const servicio = await this.servicioService.habilitarServicio(id);
      
      if (!servicio) {
        return res.status(404).json({ 
          success: false,
          message: 'Servicio no encontrado.' 
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Servicio habilitado correctamente.',
        data: servicio
      });
      
    } catch (error) {
      console.error('Error al habilitar servicio:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Error al habilitar el servicio.' 
      });
    }
  };


  // Obtener servicios asignados a un técnico
  obtenerServiciosAsignados = async (req, res) => {
    try {
      // Validar que el usuario sea un técnico
      if (req.user.rol !== 'tecnico') {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado. Solo los técnicos pueden consultar sus servicios asignados.'
        });
      }

      const tecnico_id = req.user.id;

      const visitas = await this.servicioService.obtenerServiciosPorTecnico(tecnico_id);

      if (visitas.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No tienes servicios asignados por el momento.',
          data: []
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Servicios asignados obtenidos correctamente.',
        count: visitas.length,
        data: visitas
      });

    } catch (error) {
      console.error('Error al obtener servicios asignados:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener los servicios asignados.'
      });
    }
  };


  
}