import { ContabilidadService } from '../services/contabilidad.services.js';
import { ValidationError } from 'sequelize';    

export class ContabilidadController {
    constructor() {
        this.contabilidadService = new ContabilidadService();
    }
    crearContabilidad = async (req, res) => {
        try {
          const { numero_de_cedula, correo_electronico } = req.body;
          const contabilidadExistente = await this.contabilidadService.obtenerContabilidadPorCedula(numero_de_cedula) || 
                                       await this.contabilidadService.obtenerContabilidadPorCorreo(correo_electronico);
          if (contabilidadExistente) {
            return res.status(400).json({ 
              message: 'El Contador ya está registrada (cédula o correo en uso)' 
            });
          }
          const nuevaContabilidad = await this.contabilidadService.crearContabilidad(req.body);
          return res.status(201).json({
            message: 'Contador creado exitosamente',
            data: nuevaContabilidad
          });
        } catch (error) {
          console.error('Error en crearContabilidad:', error);
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
            message: 'Error al crear el Contador',
            error: error.message 
          });
        }
      };
      obtenerContabilidadPorId = async (req, res) => {
        try {
          const contabilidad = await this.contabilidadService.obtenerContabilidadPorId(req.params.id);
          
          if (!contabilidad) {
            return res.status(404).json({ 
              message: 'Contador no encontrado' 
            });
          }
          const contabilidadSinPassword = { ...contabilidad.get(), contrasenia: undefined };
          return res.status(200).json(contabilidadSinPassword);
        } catch (error) {
          console.error('Error en obtener el Contador:', error);
          return res.status(500).json({ 
            message: 'Error al obtener el Contador',
            error: error.message 
          });
        }
      };
      obtenerContabilidadPorCedula = async (req, res) => {
        try {
          const contabilidad = await this.contabilidadService.obtenerContabilidadPorCedula(req.params.numero_cedula);
          if (!contabilidad) {
            return res.status(404).json({ message: 'Contador no encontrado' });
          }
          return res.status(200).json({ contabilidad });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error al obtener el Contador' });
        }
      };
      obtenerContabilidadPorCorreo = async (req, res) => {
        try {
          const contabilidad = await this.contabilidadService.obtenerContabilidadPorCorreo(req.params.correo_electronico);
          if (!contabilidad) {
            return res.status(404).json({ message: 'Contador no encontrado' });
          }
          return res.status(200).json({ contabilidad });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error al obtener el Contador' });
        }
      };

      // falta el de actualizar contabilidad lo cual hace referencia al rol

      eliminarContabilidad = async (req, res) => {
        try {
          await this.contabilidadService.eliminarContabilidad(req.params.id);
          return res.status(200).json({ message: 'Contador eliminada exitosamente' });
        } catch (error) {
          console.error('Error en eliminar el Contador:', error);
          return res.status(500).json({ message: 'Error al eliminar el Contador' });
        }
      };

      // autenticar contabilidad y generar token  
      autenticarContabilidad = async (req, res) => {
        try {
        const { correo_electronico, contrasenia } = req.body;
        
        const contabilidad = await this.contabilidadService.autenticarContabilidad(
            correo_electronico, 
            contrasenia
        );
        const token = 'generar-token-jwt-aqui'; 
        return res.status(200).json({
            message: 'Autenticación exitosa',
            token,
            contabilidad: {
            id: contabilidad.id,
            nombre: contabilidad.nombre,
            correo_electronico: contabilidad.correo_electronico,
            rol: contabilidad.rol
            }
        });
        } catch (error) {
        console.error('Error en autenticarAdmin:', error);
        return res.status(401).json({ 
            message: 'Error de autenticación',
            error: error.message 
        });
        }
    };
}