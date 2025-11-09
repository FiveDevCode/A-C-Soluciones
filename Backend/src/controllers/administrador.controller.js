// src/controllers/admin.controller.js
import { AdminService } from '../services/administrador.services.js';
import { ValidationError } from 'sequelize';

export class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }
  crearAdmin = async (req, res) => {
    try {
      const { numero_cedula, correo_electronico } = req.body;
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
        const fieldErrors = {};
        for (const err of error.errors) {
          if (err.path) {
            fieldErrors[err.path] = err.message;
          }
        }

        return res.status(400).json({ errors: fieldErrors });
      }
      return res.status(500).json({
        message: 'Error al crear el administrador',
        error: error.message
      });
    }
  };
  obtenerAdminPorId = async (req, res) => {
    try {
      const admin = await this.adminService.obtenerAdminPorId(req.params.id);

      if (!admin) {
        return res.status(404).json({
          message: 'Administrador no encontrado'
        });
      }
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
  obtenerAdmins = async (req, res) => {
    try {
      const admins = await this.adminService.obtenerAdmins();
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
        const fieldErrors = {};
        for (const err of error.errors) {
          if (err.path) {
            fieldErrors[err.path] = err.message;
          }
        }

        return res.status(400).json({ errors: fieldErrors });
      }
      return res.status(500).json({
        message: 'Error al actualizar el administrador',
        error: error.message
      });
    }
  };
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
  autenticarAdmin = async (req, res) => {
    try {
      const { correo_electronico, contrasenia } = req.body;

      const admin = await this.adminService.autenticarAdmin(
        correo_electronico,
        contrasenia
      );
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