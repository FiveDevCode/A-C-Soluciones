import { SolicitudModel } from "../models/solicitud.model.js";
import { ClienteModel } from "../models/cliente.model.js";
import { ServicioModel } from "../models/servicios.model.js";
import { AdminModel } from "../models/administrador.model.js";

export class SolicitudRepository {
  constructor() {
    this.model = SolicitudModel.Solicitud;
    this.clienteModel = ClienteModel.Cliente;
    this.servicioModel = ServicioModel.Servicio;
    this.adminModel = AdminModel.Admin; 
    this.setupAssociations();
  }
  setupAssociations() {
    if (!this.model.associations?.cliente) {
      this.model.belongsTo(this.clienteModel, {
        foreignKey: 'cliente_id_fk',
        as: 'cliente'
      });
    }
    if (!this.model.associations?.servicio) {
      this.model.belongsTo(this.servicioModel, {
        foreignKey: 'servicio_id_fk',
        as: 'servicio'
      });
    }
    if (!this.model.associations?.admin) {
      this.model.belongsTo(this.adminModel, {
        foreignKey: 'admin_id_fk',
        as: 'admin'
      });
    }
  }
  async crear(data) {
    const clienteExiste = await this.clienteExiste(data.cliente_id_fk);
    const servicioExiste = await this.servicioExiste(data.servicio_id_fk);
    if (!clienteExiste || !servicioExiste) {
      throw new Error('Cliente o servicio no encontrado');
    }
    return await this.model.create(data);
  }
  async obtenerTodos() {
    return await this.model.findAll({
      include: [
        {
          model: this.clienteModel,
          as: 'cliente',
          attributes: ['id', 'nombre', 'apellido', 'telefono']
        },
        {
          model: this.adminModel, 
          as: 'admin',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: this.servicioModel,
          as: 'servicio',
          attributes: ['id', 'nombre', 'descripcion']
        }
      ],
      order: [['fecha_solicitud', 'DESC']]
    });
  }
  async obtenerPorId(id) {
    return await this.model.findByPk(id, {
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
  }
  async obtenerPorCliente(cliente_id) {
    return await this.model.findAll({
      where: { cliente_id_fk: cliente_id },
      include: [
        {
          model: this.servicioModel,
          as: 'servicio',
          attributes: ['id', 'nombre', 'descripcion']
        }
      ],
      order: [['fecha_solicitud', 'DESC']]
    });
  }
  async clienteExiste(cliente_id) {
    const cliente = await this.clienteModel.findByPk(cliente_id);
    return !!cliente;
  }
  async servicioExiste(servicio_id) {
    const servicio = await this.servicioModel.findByPk(servicio_id);
    return !!servicio;
  }
  async actualizarEstado(id, estado) {
    const solicitud = await this.model.findByPk(id);
    if (!solicitud) return null;

    await solicitud.update({ estado });
    return solicitud;
  }
  async eliminar(id) {
    const solicitud = await this.model.findByPk(id);
    if (!solicitud) return null;
    await solicitud.destroy();
    return solicitud;
  }

  async obtenerSolicitudPorId(id) {
        return await SolicitudModel.Solicitud.findByPk(id);
    }

}
