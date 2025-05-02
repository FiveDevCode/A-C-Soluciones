// src/controllers/admin.controller.js
import { AdminService } from '../services/administrador.services.js';
import { ValidationError } from 'sequelize';

export class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  // Registrar administrador en el sistema
  crearAdmin = async (req, res) => {
    try {
      const { numero_cedula, correo_electronico } = req.body;

      //Verificar si ya existe un admin con esa cédula o correo
      const adminExistente = await this.adminService.obtenerAdminPorCedula(numero_cedula) || 
                             await this.adminService.obtenerAdminPorCorreo(correo_electronico);

      if (adminExistente) {
        return res.status(400).json({ 
          message: 'El administrador ya está registrado (cédula o correo en uso)' 
        });
      }

      const nuevoAdmin = await this.adminService.crearAdmin(req.body);
      return res.status(201).json({
        message: 'Administrador creado exitosamente',
        data: nuevoAdmin
      });

    } catch (error) {
      console.error('Error en crearAdmin:', error);

      if (error instanceof ValidationError) {
        const mensajes = error.errors.map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ errors: mensajes });
      }

      return res.status(500).json({ 
        message: 'Error al crear el administrador',
        error: error.message 
      });
    }
  };

  // Obtener administrador por ID
  obtenerAdminPorId = async (req, res) => {
    try {
      const admin = await this.adminService.obtenerAdminPorId(req.params.id);
      
      if (!admin) {
        return res.status(404).json({ 
          message: 'Administrador no encontrado' 
        });
      }

      // No retornar la contraseña en la respuesta
      const adminSinPassword = { ...admin.get(), contrasenia: undefined };
      return res.status(200).json(adminSinPassword);

    } catch (error) {
      console.error('Error en obtenerAdminPorId:', error);
      return res.status(500).json({ 
        message: 'Error al obtener el administrador',
        error: error.message 
      });
    }
  };

  // Obtener administrador por cédula
  obtenerAdminPorCedula = async (req, res) => {
    try {
      const admin = await this.adminService.obtenerAdminPorCedula(req.params.numero_cedula);
      
      if (!admin) {
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }

      return res.status(200).json({ admin });
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al obtener el administrador' });
    }
  };

  


  // Obtener administrador por correo
  obtenerAdminPorCorreo = async (req, res) => {
    try {
      const admin = await this.adminService.obtenerAdminPorCorreo(req.params.correo_electronico);
      
      if (!admin) {
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }

      const adminSinPassword = { ...admin.get(), contrasenia: undefined };
      return res.status(200).json(adminSinPassword);

    } catch (error) {
      console.error('Error en obtenerAdminPorCorreo:', error);
      return res.status(500).json({ 
        message: 'Error al buscar administrador por correo',
        error: error.message 
      });
    }
  };

  // Obtener todos los administradores
  obtenerAdmins = async (req, res) => {
    try {
      const admins = await this.adminService.obtenerAdmins();
      
      // Eliminar contraseñas de la respuesta
      const adminsSinPassword = admins.map(admin => {
        const adminData = admin.get();
        delete adminData.contrasenia;
        return adminData;
      });

      return res.status(200).json(adminsSinPassword);

    } catch (error) {
      console.error('Error en obtenerAdmins:', error);
      return res.status(500).json({ 
        message: 'Error al obtener los administradores',
        error: error.message 
      });
    }
  };

  // Actualizar administrador
  actualizarAdmin = async (req, res) => {
    try {
      const adminActualizado = await this.adminService.actualizarAdmin(
        req.params.id, 
        req.body
      );

      if (!adminActualizado) {
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }

      const adminSinPassword = { ...adminActualizado.get(), contrasenia: undefined };
      return res.status(200).json({
        message: 'Administrador actualizado correctamente',
        data: adminSinPassword
      });

    } catch (error) {
      console.error('Error en actualizarAdmin:', error);

      if (error instanceof ValidationError) {
        const mensajes = error.errors.map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ errors: mensajes });
      }

      return res.status(500).json({ 
        message: 'Error al actualizar el administrador',
        error: error.message 
      });
    }
  };

  // Eliminar administrador (marcar como inactivo)
  eliminarAdmin = async (req, res) => {
    try {
      const adminEliminado = await this.adminService.eliminarAdmin(req.params.id);
      
      if (!adminEliminado) {
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }

      return res.status(200).json({ 
        message: 'Administrador desactivado correctamente' 
      });

    } catch (error) {
      console.error('Error en eliminarAdmin:', error);
      return res.status(500).json({ 
        message: 'Error al desactivar el administrador',
        error: error.message 
      });
    }
  };

  // Autenticar administrador (login)
  autenticarAdmin = async (req, res) => {
    try {
      const { correo_electronico, contrasenia } = req.body;
      
      const admin = await this.adminService.autenticarAdmin(
        correo_electronico, 
        contrasenia
      );

      // En un caso real, aquí generarías un token JWT
      const token = 'generar-token-jwt-aqui'; // Implementar lógica real

      return res.status(200).json({
        message: 'Autenticación exitosa',
        token,
        admin: {
          id: admin.id,
          nombre: admin.nombre,
          correo_electronico: admin.correo_electronico,
          rol: admin.rol
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