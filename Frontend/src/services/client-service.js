import api from "../controllers/common/api.controller";


const createClient = (IdCard, name, lastName, email, phone, password, address) => {
  return api.post("/cliente", {
    numero_de_cedula: IdCard,
    nombre: name,
    apellido: lastName,
    correo_electronico: email,
    telefono: phone,
    contrasenia: password,
    direccion: address
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const getServiceList = () => {
  return api.get("/servicios/activos")
}

const getHistorialServiciosByCliente = (clienteId) => {
  return api.get(`/cliente/${clienteId}/servicios`);
}



const createRequest = (serviceAddress, description, comments, requestId, clientId) => {
  const token = localStorage.getItem("authToken");

  return api.post("/solicitudes", {
    direccion_servicio: serviceAddress,
    descripcion: description,
    comentarios: comments,
    servicio_id_fk: requestId,
    cliente_id_fk: clientId

  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

}

const getClient = (id) => {
  return api.get(`/cliente/${id}`)
}

export const clientService = {
  createClient,
  getServiceList,
  createRequest,
  getClient,
  getHistorialServiciosByCliente
}