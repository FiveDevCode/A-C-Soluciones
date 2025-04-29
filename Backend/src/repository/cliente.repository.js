
import { ClienteModel } from "../models/cliente.model";


//Crea el cliente
export class ClienteRepository {
    async crearCliente(data){
        return await ClienteModel.Cliente.create(data);
    }

    //Buscar cliente por ID
    async obtenerClientePorId(id) {
        return await ClienteModel.Cliente.findByPk(id);
    }

    //Buscar cliente por email

    async obtenerClientePorEmail (correo_electronico){
        return await ClienteModel.Cliente.findOne({ where:{correo_electronico}});
    }

        // Buscar cliente por teléfono
    async obtenerClientePorTelefono(telefono) {
        return await ClienteModel.Cliente.findOne({ where: { telefono } });
    }


    // Obtener todos los clientes (útil para admin)
    async obtenerTodosLosClientes() {
        return await ClienteModel.Cliente.findAll();
    }
     //Obtiene TODOS los clientes activos
    async ObtenerClientesActivos() {
        return await ClienteModel.Cliente.findAll({ where: { estado: 'activo' } });
    }

    //Borrado lógico del cliente
    async eliminarCliente(id) {
        const cliente = await ClienteModel.Cliente.findByPk(id); //busca el cliente
        if(!cliente)return null; //sino lo encuentra retorna null

        //borrado lógico cambia el estado a inactivo
        cliente.estado='inactivo';
        await cliente.save();

        return cliente;
        
      }
      async obtenerClientePorCedula(numero_de_cedula) {
        return await ClienteModel.Cliente.findOne({
            where: { numero_de_cedula }
        });
    }
    //Actualizar cliente
        async actualizarCliente(id, data) {
            const cliente = await ClienteModel.Cliente.findByPk(id);
            if (!cliente) return null;
            await cliente.update(data);
            return cliente;
        }

}

