
import { SolicitudModel } from "../models/solicitud.model.js";
import { ClienteModel } from "../models/cliente.model.js";
import { ServicioModel } from "../models/servicios.model.js";


export class SolicitudRepository {
    constructor() {
        this.solicitudModel = SolicitudModel.Solicitud;
        this.clienteModel = ClienteModel.Cliente;
        this.servicioModel = ServicioModel.Servicio;
    }

    // Crear una nueva solicitud
    async crear(solicitudData) {
        try {
            return await this.solicitudModel.create(solicitudData);
        } catch (error) {
            console.error("Error en repository al crear solicitud:", error);
            throw error;
        }
    }

    // Verificar si existe un cliente
    async clienteExiste(cliente_id_fk) {
        try {
            const cliente = await this.clienteModel.findByPk(cliente_id_fk);
            return !!cliente;
        } catch (error) {
            console.error("Error en repository al verificar cliente:", error);
            throw error;
        }
    }

    // Verificar si existe un servicio
    async servicioExiste(servicio_id_fk) {
        try {
            const servicio = await this.servicioModel.findByPk(servicio_id_fk);
            return !!servicio;
        } catch (error) {
            console.error("Error en repository al verificar servicio:", error);
            throw error;
        }
    }

    // Obtener todas las solicitudes con relaciones
    async obtenerTodos() {
        try {
            return await this.solicitudModel.findAll({
                include: [
                    {
                        model: this.clienteModel,
                        as: 'cliente',
                        attributes: ['id', 'nombre', 'apellido', 'telefono']
                    },
                    {
                        model: this.servicioModel,
                        as: 'servicio',
                        attributes: ['id', 'nombre', 'descripcion']
                    }
                ],
                order: [['fecha_solicitud', 'DESC']]
            });
        } catch (error) {
            console.error("Error en repository al obtener solicitudes:", error);
            throw error;
        }
    }

    // Obtener solicitudes por cliente
    async obtenerPorCliente(cliente_id_fk) {
        try {
            return await this.solicitudModel.findAll({
                where: { cliente_id_fk },
                include: [
                    {
                        model: this.servicioModel,
                        as: 'servicio',
                        attributes: ['id', 'nombre', 'descripcion']
                    }
                ],
                order: [['fecha_solicitud', 'DESC']]
            });
        } catch (error) {
            console.error("Error en repository al obtener solicitudes por cliente:", error);
            throw error;
        }
    }

    // Obtener una solicitud por ID
    async obtenerPorId(id) {
        try {
            return await this.solicitudModel.findByPk(id, {
                include: [
                    {
                        model: this.clienteModel,
                        as: 'cliente',
                        attributes: ['id', 'nombre', 'apellido', 'telefono', 'direccion']
                    },
                    {
                        model: this.servicioModel,
                        as: 'servicio',
                        attributes: ['id', 'nombre', 'descripcion']
                    }
                ]
            });
        } catch (error) {
            console.error("Error en repository al obtener solicitud por ID:", error);
            throw error;
        }
    }

    // Actualizar el estado de una solicitud
    async actualizarEstado(id, estado) {
        try {
            const solicitud = await this.solicitudModel.findByPk(id);
            
            if (!solicitud) {
                return null;
            }
            
            solicitud.estado = estado;
            await solicitud.save();
            
            return solicitud;
        } catch (error) {
            console.error("Error en repository al actualizar estado de solicitud:", error);
            throw error;
        }
    }
    //Eliminar una solicitud
    async eliminarSolicitud (id){
      try {
        const solicitud = await this.solicitudModel.findByPk(id);
        if(!solicitud){
            return null;
        } 
        
        await solicitud.destroy();
        return solicitud;
      } catch (error) {
        console.error("Error al eliminar la solicitud",error);
        throw error;
        
      }

    }
}