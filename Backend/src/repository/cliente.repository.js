import { ClienteModel } from "../models/cliente.model.js";


export class ClienteRepository {
    async crearCliente(data){
        return await ClienteModel.Cliente.create(data);
    }
    async obtenerClientePorId(id) {
        return await ClienteModel.Cliente.findByPk(id);
    }
    async obtenerClientePorEmail (correo_electronico){
        return await ClienteModel.Cliente.findOne({ where:{correo_electronico}});
    }
    async obtenerClientePorTelefono(telefono) {
        return await ClienteModel.Cliente.findOne({ where: { telefono } });
    }
    async obtenerTodosLosClientes() {
        return await ClienteModel.Cliente.findAll();
    }
    async ObtenerClientesActivos() {
        return await ClienteModel.Cliente.findAll({ where: { estado: 'activo' } });
    }
    async eliminarCliente(id) {
        const cliente = await ClienteModel.Cliente.findByPk(id); 
        if(!cliente)return null; 
        cliente.estado='inactivo';
        await cliente.save();
        return cliente;
    }
    async obtenerClientePorCedula(numero_de_cedula) {
        return await ClienteModel.Cliente.findOne({
            where: { numero_de_cedula }
        });
    }
    async actualizarCliente(id, data) {
        const cliente = await ClienteModel.Cliente.findByPk(id);
        if (!cliente) return null;
        await cliente.update(data);
        return cliente;
    }

    async actualizarinfoCliente(id, camposActualizados) {
        const cliente = await ClienteModel.Cliente.findByPk(id);
        if (!cliente) return null;
        await cliente.update(camposActualizados);
        return cliente;
  }
}

