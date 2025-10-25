import { RegistroFacturaService } from '../services/registrar_facturas.services.js';
import { ValidationError } from 'sequelize';

export class RegistrarFacturasController {
    constructor() {
        this.registroFacturaService = new RegistroFacturaService();
    }

    crearRegistroFactura = async (req, res) => {
        try {
            const { numero_factura } = req.body;
            const facturaExistente = await this.registroFacturaService.obtenerRegistroPorNumero(numero_factura);
            if (facturaExistente) {
                return res.status(400).json({
                    message: 'La factura ya está registrada (número de factura en uso)'
                });
            }
            const nuevaFactura = await this.registroFacturaService.crearRegistroFactura(req.body);
            return res.status(201).json({
                message: 'Factura registrada exitosamente',
                data: nuevaFactura
            });
        } catch (error) {
            console.error('Error en registrarFactura:', error);
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
                message: 'Error al registrar la factura',
                error: error.message
            });
        }
    };

    obtenerRegistroPorCliente = async (req, res) => {
        try {
            const { id_cliente } = req.params;
            const facturas = await this.registroFacturaService.obtenerRegistroPorCliente(id_cliente);
            if (!facturas || facturas.length === 0) {
                return res.status(404).json({
                    message: 'No se encontraron facturas para este cliente'
                });
            }
            return res.status(200).json(facturas);
        } catch (error) {
            console.error('Error en obtenerRegistrosPorCliente:', error);
            return res.status(500).json({
                message: 'Error al obtener las facturas del cliente',
                error: error.message
            });
        }
    };


    obtenerRegistroPorId = async (req, res) => {
        try {
            const factura = await this.registroFacturaService.obtenerRegistroPorId(req.params.id);
            if (!factura) {
                return res.status(404).json({
                    message: 'Factura no encontrada'
                });
            }
            return res.status(200).json(factura);

        }
        catch (error) {
            console.error('Error en obtenerFacturaPorId:', error);
            return res.status(500).json({
                message: 'Error al obtener la factura',
                error: error.message
            });
        }
    };

    obtenerRegistroPorNumero = async (req, res) => {
        try {
            const { numero_factura } = req.params;
            const factura = await this.registroFacturaService.obtenerRegistroPorNumero(numero_factura);
            if (!factura) {
                return res.status(404).json({ message: 'Factura no encontrada' });
            }
            return res.status(200).json({ factura });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener la factura' });
        }
    };

    obtenerRegistros = async (req, res) => {
        try {
            const facturas = await this.registroFacturaService.obtenerRegistros();
            return res.status(200).json(facturas);
        } catch (error) {
            console.error('Error en obtenerFacturas:', error);
            return res.status(500).json({
                message: 'Error al obtener las facturas',
                error: error.message
            });
        }
    };

    obtenerPorSaldoPendiente = async (req, res) => {
        try {
            const facturas = await this.registroFacturaService.obtenerPorSaldoPendiente();
            return res.status(200).json(facturas);
        } catch (error) {
            console.error('Error en obtenerPorSaldoPendiente:', error);
            return res.status(500).json({
                message: 'Error al obtener las facturas con saldo pendiente',
                error: error.message
            });
        }
    };

    obtenerPorEstado = async (req, res) => {

        try {
            const { estado_factura } = req.params;
            const facturas = await this.registroFacturaService.obtenerPorEstado(estado_factura);
            return res.status(200).json(facturas);
        }
        catch (error) {
            console.error('Error en obtenerPorEstado:', error);
            return res.status(500).json({
                message: 'Error al obtener las facturas por estado',
                error: error.message
            });
        }
    };

    actualizarRegistroFactura = async (req, res) => {
        try {
            const facturaActualizada = await this.registroFacturaService.actualizarRegistroFactura(req.params.id, req.body);
            if (!facturaActualizada) {
                return res.status(404).json({ message: 'Factura no encontrada' });
            }
            return res.status(200).json({
                message: 'Factura actualizada exitosamente',
                data: facturaActualizada
            });
        } catch (error) {
            console.error('Error en actualizarFactura:', error);
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
                message: 'Error al actualizar la factura',
                error: error.message
            });
        }
    };

    eliminarRegistroFactura = async (req, res) => {
        try {
            const facturaEliminada = await this.registroFacturaService.eliminarRegistroFactura(req.params.id);
            if (!facturaEliminada) {
                return res.status(404).json({ message: 'Factura no encontrada' });
            }
            return res.status(200).json({ message: 'Factura eliminada exitosamente' });
        } catch (error) {
            console.error('Error en eliminarFactura:', error);
            return res.status(500).json({
                message: 'Error al eliminar la factura',
                error: error.message
            });
        }
    };

}