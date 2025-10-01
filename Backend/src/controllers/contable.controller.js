import { ContableService } from "../services/contable.service";
import { ValidationError } from "sequelize";

export class ContableController {
    constructor() {
        this.contableService = new ContableService();
    }

    crearContable = async (req, res) => {
    try {
      const { numero_de_cedula } = req.body;
  
      const contableExistente = await this.contableService.obtenerContablePorcedula(numero_de_cedula);
  
      if (contableExistente) {
        return res.status(400).json({ message: 'El contable ya está registrado.' });
      }
  
      const nuevoContable = await this.contableService.crearContable(req.body);
      return res.status(201).json(nuevoContable);
  
    } catch (error) {
      console.error(error);
  
      if (error instanceof ValidationError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
            if (err.path) {
                fieldErrors[err.path] = err.message;
            }
        });
        return res.status(400).json({ errors: fieldErrors });
      }

  
      return res.status(500).json({ message: 'Error al crear el empleado.' });
    }
  };
  
  
  obtenerTecnicoPorId = async (req, res) => {
    try {
      const contable = await this.contableService.obtenerTecnicoPorId(req.params.id);
      if (!contable) {
        return res.status(404).json({ message: 'Empleado no encontrado.' });
      }
      return res.status(200).json(contable);
    } catch (error) {
      console.error(error);
      
      return res.status(500).json({ message: 'Error al obtener el empleado.' });
    }
  };
  // obtener empleados por cedula
  obtenerContablePorcedula = async (req, res) => {
    try {
      const contable = await this.contableService.obtenerContablePorcedula(req.params.numero_de_cedula);
      
      if (!contable) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      
      return res.status(200).json({ contable });
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener el empleado' });
    }
  };
  
  // obtener los empleados que estan registrados en el sistema 
  obtenerContables = async (req, res) => {
    try {
      const contables = await this.contableService.obtenerContables();
      return res.status(200).json(contables);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener los empleados.' });
    }
  };
  // actualizar empleado si esta registrado en el sistema 
  actualizarContable = async (req, res) => {
    try {
      const contableActualizado = await this.contableService.actualizarContable(req.params.id, req.body);
      if (!contableActualizado) {
        return res.status(404).json({ message: 'Empleado no encontrado.' });
      }
      return res.status(200).json(contableActualizado);
    } catch (error) {
      console.error(error);
      if (error instanceof ValidationError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
            if (err.path) {
                fieldErrors[err.path] = err.message;
            }
        });
        return res.status(400).json({ errors: fieldErrors });
      }
      return res.status(500).json({ message: 'Error al actualizar el empleado.' });
    }
  };

}