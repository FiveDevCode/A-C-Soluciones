import { InventarioService, INVENTARIO_ERRORS } from '../services/inventario.services.js';
import { ValidationError } from 'sequelize';


export class InventarioController {
    constructor() {
        this.inventarioService = new InventarioService();
    }

    crearInventario = async (req, res) => {
        
        try {
            

            const nuevoItem = await this.inventarioService.crearInventario(req.body);
            

            return res.status(201).json({ 
                message: 'Item de inventario registrado exitosamente.',
                item: nuevoItem 
            });

        } catch (error) {

            console.error('Error al registrar item de inventario:', error);


            if (error.name === 'CodigoDuplicadoError' || (error instanceof ValidationError && error.errors.some(e => e.type === 'unique violation' && e.path === 'codigo'))) {

                return res.status(400).json({ 
                    message: INVENTARIO_ERRORS.CODIGO_DUPLICADO 
                });
            }


            if (error instanceof ValidationError) {
                const fieldErrors = {};
                error.errors.forEach((err) => {
                    if (err.path && err.message) {
                        fieldErrors[err.path] = err.message;
                    }
                });
                return res.status(400).json({ 
                    message: 'Error de validación en el formulario.', 
                    errors: fieldErrors 
                });
            }
            
            return res.status(500).json({ 
                message: 'Error al registrar el item de inventario. Intente nuevamente.' 
            });
        }
    };
    
    obtenerTodos = async (req, res) => {
        try {
            const items = await this.inventarioService.obtenerTodos();
            return res.status(200).json(items);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener los items de inventario.' });
        }
    };

    obtenerInventarioPorId = async (req, res) => {
        try {
            const item = await this.inventarioService.obtenerInventarioPorId(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item de inventario no encontrado.' });
            }
            return res.status(200).json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener el item de inventario.' });
        }
    };

    actualizarInventario = async (req, res) => {
        try {
            const itemActualizado = await this.inventarioService.actualizarInventario(req.params.id, req.body);

            if (!itemActualizado) {
                return res.status(404).json({ message: 'Item de inventario no encontrado para actualizar.' });
            }

            return res.status(200).json({
                message: 'Item de inventario actualizado exitosamente.',
                item: itemActualizado
            });
        } catch (error) {
            console.error('Error al actualizar item de inventario:', error);

            if (error instanceof ValidationError) {
                const fieldErrors = {};
                error.errors.forEach((err) => {
                    if (err.path && err.message) {
                        fieldErrors[err.path] = err.message;
                    }
                });
                return res.status(400).json({ 
                    message: 'Error de validación al actualizar el item.', 
                    errors: fieldErrors 
                });
            }

            return res.status(500).json({ message: 'Error al actualizar el item de inventario. Intente nuevamente.' });
        }
    };

    eliminarInventario = async (req, res) => {
        try {
            const inventarioEliminado = await this.inventarioService.eliminarInventario(req.params.id);
            
            if (!inventarioEliminado) {
                return res.status(404).json({ message: 'La herramienta no fue encontrada.' });
            }
            
            return res.status(200).json({ message: 'Herramienta eliminada correctamente del inventario.' });
        } catch (error) {
            console.error('Error al eliminar la herramienta:', error);
            return res.status(500).json({ message: 'Error al eliminar la herramienta. Intente nuevamente.' });
        }
        
    }
}