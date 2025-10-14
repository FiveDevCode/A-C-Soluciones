import { RegistrarCuentasService } from "../services/registrar_cuentas.services.js";
import { ValidationError } from "sequelize";

export class RegistrarCuentasController {
  constructor() {
    this.registrarCuentasService = new RegistrarCuentasService();
  }

  crearRegistroCuenta = async (req, res) => {
    try {
      const { numero_cuenta, nit } = req.body;
      const cuentaExistente =
        await this.registrarCuentasService.obtenerCuentaPorNumero(
          numero_cuenta
        );
      if (cuentaExistente) {
        return res.status(400).json({
          message: "La cuenta ya está registrada (número de cuenta en uso)",
        });
      }
      const nuevaCuenta =
        await this.registrarCuentasService.crearRegistroCuenta(req.body);
      return res.status(201).json({
        message: "Cuenta registrada exitosamente",
        data: nuevaCuenta,
      });
    } catch (error) {
      console.error("Error en crearRegistroCuenta:", error);
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
        message: "Error al registrar la cuenta",
        error: error.message,
      });
    }
  };

    obtenerCuentaPorId = async (req, res) => {
        try {
            const { id_cliente } = req.params;
            const cuentas = await this.registrarCuentasService.obtenerCuentaPorId(id_cliente);
            if (!cuentas || cuentas.length === 0) {
                return res.status(404).json({
                    message: 'No se encontraron cuentas para este cliente'
                });
            }
            return res.status(200).json(cuentas);
        } catch (error) {
            console.error('Error en obtenerCuentaPorId:', error);
            return res.status(500).json({
                message: 'Error al obtener las cuentas del cliente',
                error: error.message
            });
        }
    };

    obtenerCuentaPorIdCuenta = async (req, res) => {
        try {
            const cuenta = await this.registrarCuentasService.obtenerCuentaPorIdCuenta(req.params.id);
            if (!cuenta) {
                return res.status(404).json({
                    message: 'Cuenta no encontrada'
                });
            }
            return res.status(200).json(cuenta);
        } catch (error) {
            console.error('Error en obtenerCuentaPorIdCuenta:', error);
            return res.status(500).json({
                message: 'Error al obtener la cuenta',
                error: error.message
            });
        }
    };

    obtenerCuentaPorNumero = async (req, res) => {
        try {
            const { numero_cuenta } = req.params;
            const cuenta = await this.registrarCuentasService.obtenerCuentaPorNumero(numero_cuenta);
            if (!cuenta) {
                return res.status(404).json({
                    message: 'Cuenta no encontrada'
                });
            }
            return res.status(200).json(cuenta);
        } catch (error) {
            console.error('Error en obtenerCuentaPorNumero:', error);
            return res.status(500).json({
                message: 'Error al obtener la cuenta',
                error: error.message
            });
        }
    };

    obtenerCuentaPorNit = async (req, res) => {
        try {
            const { nit } = req.params; 
            const cuenta = await this.registrarCuentasService.obtenerCuentaPorNit(nit);
            if (!cuenta) {
                return res.status(404).json({
                    message: 'Cuenta no encontrada'
                });
            }
            return res.status(200).json(cuenta);
        } catch (error) {
            console.error('Error en obtenerCuentaPorNit:', error);
            return res.status(500).json({
                message: 'Error al obtener la cuenta',
                error: error.message
            });
        }
    };

    obtenerCuentas = async (req, res) => {
        try {
            const cuentas = await this.registrarCuentasService.obtenerCuentas();
            return res.status(200).json(cuentas);
        } catch (error) {
            console.error('Error en obtenerCuentas:', error);
            return res.status(500).json({
                message: 'Error al obtener las cuentas',
                error: error.message
            });
        }
    };

    actualizarRegistroCuenta = async (req, res) => {
        try {
            const cuentaActualizada = await this.registrarCuentasService.actualizarRegistroCuenta(req.params.id, req.body);
            if (!cuentaActualizada) {
                return res.status(404).json({
                    message: 'Cuenta no encontrada'
                });
            }
            return res.status(200).json({
                message: 'Cuenta actualizada exitosamente',
                data: cuentaActualizada
            });
        } catch (error) {
            console.error('Error en actualizarRegistroCuenta:', error);
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
                message: 'Error al actualizar la cuenta',
                error: error.message
            });
        }   
    };

    eliminarRegistroCuenta = async (req, res) => {
        try {
            const cuentaEliminada = await this.registrarCuentasService.eliminarRegistroCuenta(req.params.id);   
            if (!cuentaEliminada) {
                return res.status(404).json({
                    message: 'Cuenta no encontrada'
                });
            }
            return res.status(200).json({
                message: 'Cuenta eliminada exitosamente',
                data: cuentaEliminada
            });
        } catch (error) {
            console.error('Error en eliminarRegistroCuenta:', error);
            return res.status(500).json({
                message: 'Error al eliminar la cuenta',
                error: error.message
            });
        }
    };
}
