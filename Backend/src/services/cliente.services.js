import { ClienteRepository } from "../repository/cliente.repository.js";
import { encryptPasswordHook } from "../hooks/encryptPassword.js";

export class ClienteService { 
    constructor() {
        this.clienteRepository = new ClienteRepository();
    }

    async crearCliente(data) {
        return await this.clienteRepository.crearCliente(data);
    }
    async obtenerClientePorId(id) {
        return await this.clienteRepository.obtenerClientePorId(id);
    }
    async obtenerClientePorEmail(correo_electronico) {
        return await this.clienteRepository.obtenerClientePorEmail(correo_electronico);
    }
    
    async obtenerTodosLosClientes() {
        return await this.clienteRepository.obtenerTodosLosClientes();
    }
    async obtenerClientesActivos() {
        return await this.clienteRepository.ObtenerClientesActivos();
    }
    async obtenerClientePorCedula(numero_de_cedula) {
        return await this.clienteRepository.obtenerClientePorCedula(numero_de_cedula);
    }

    async eliminarCliente(id) {
        const clienteEliminado = await this.clienteRepository.eliminarCliente(id);
        if (!clienteEliminado) throw new Error('Cliente no encontrado');
        return clienteEliminado;

    }
    
    async actualizarCliente(id, data) {
        return await this.clienteRepository.actualizarCliente(id, data);
    } 
    
    async actualizarPerfilCliente(clienteId, datosActualizados) {
    if (datosActualizados.contrasenia) {
      datosActualizados.contrasenia = await encryptPasswordHook(datosActualizados.contrasenia);
    }
    return this.clienteRepository.actualizarinfoCliente(clienteId, datosActualizados);
  } 
}