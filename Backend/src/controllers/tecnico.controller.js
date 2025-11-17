import { TecnicoService } from '../services/tecnico.services.js';
import { ValidationError } from 'sequelize';

export class TecnicoController {
  constructor() {
    this.tecnicoService = new TecnicoService();
  }
  // registrar tecnicos en el sistema 
  crearTecnico = async (req, res) => {
    try {
      const { numero_de_cedula } = req.body;

      // Primero verificamos si ya existe un técnico con esa cédula
      const tecnicoExistente = await this.tecnicoService.obtenerTecnicoPorcedula(numero_de_cedula);

      if (tecnicoExistente) {
        return res.status(400).json({ message: 'El técnico ya está registrado.' });
      }

      // Si no existe, lo creamos
      const nuevoTecnico = await this.tecnicoService.crearTecnico(req.body);
      return res.status(201).json(nuevoTecnico);

    } catch (error) {
      console.error(error);

      if (error instanceof ValidationError) {
        const fieldErrors = {};
        for (const err of error.errors) {
          if (err.path) {
            fieldErrors[err.path] = err.message;
          }
        }

        return res.status(400).json({ errors: fieldErrors });
      }


      return res.status(500).json({ message: 'Error al crear el empleado.' });
    }
  };

  // obtener empleados por id
  obtenerTecnicoPorId = async (req, res) => {
    try {
      const tecnico = await this.tecnicoService.obtenerTecnicoPorId(req.params.id);
      if (!tecnico) {
        return res.status(404).json({ message: 'Empleado no encontrado.' });
      }
      return res.status(200).json(tecnico);
    } catch (error) {
      console.error(error);

      return res.status(500).json({ message: 'Error al obtener el empleado.' });
    }
  };
  // obtener empleados por cedula
  obtenerTecnicoPorCedula = async (req, res) => {
    try {
      const tecnico = await this.tecnicoService.obtenerTecnicoPorcedula(req.params.numero_de_cedula);

      if (!tecnico) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }

      return res.status(200).json({ tecnico });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener el empleado' });
    }
  };

  // obtener los empleados que estan registrados en el sistema 
  obtenerTecnicos = async (req, res) => {
    try {
      const tecnicos = await this.tecnicoService.obtenerTecnicos();
      return res.status(200).json(tecnicos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener los empleados.' });
    }
  };
  // actualizar empleado si esta registrado en el sistema 
  actualizarTecnico = async (req, res) => {
    try {
      const tecnicoActualizado = await this.tecnicoService.actualizarTecnico(req.params.id, req.body);
      if (!tecnicoActualizado) {
        return res.status(404).json({ message: 'Empleado no encontrado.' });
      }
      return res.status(200).json(tecnicoActualizado);
    } catch (error) {
      console.error(error);
      if (error instanceof ValidationError) {
        const fieldErrors = {};
        for (const err of error.errors) {
          if (err.path) {
            fieldErrors[err.path] = err.message;
          }
        }

        return res.status(400).json({ errors: fieldErrors });
      }
      return res.status(500).json({ message: 'Error al actualizar el empleado.' });
    }
  };
  // eliminar empleado si esta registrado en el sistema 
  eliminarTecnico = async (req, res) => {
    try {
      const tecnicoEliminado = await this.tecnicoService.eliminarTecnico(req.params.id);
      if (!tecnicoEliminado) {
        return res.status(404).json({ message: 'Empleado no encontrado.' });
      }
      return res.status(200).json({ message: 'Empleado eliminado correctamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al eliminar el empleado.' });
    }
  };
}
