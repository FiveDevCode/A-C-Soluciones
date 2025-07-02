import axios from "axios";


const createClient = (IdCard, name, lastName, email, phone, password, address) => {
  return axios.post("http://localhost:8000/api/cliente", {
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
  return axios.get("http://localhost:8000/api/servicios/activos")
}

const createRequest = (serviceAddress, description, comments, requestId, clientId) => {
  const token = sessionStorage.getItem("authToken");

  return axios.post("http://localhost:8000/api/solicitudes", {
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

export const clientService = {
  createClient,
  getServiceList,
  createRequest,
}