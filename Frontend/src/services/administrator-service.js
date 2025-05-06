import axios from "axios";


const createTechnical = (IdCard, name, lastName, email, phone, password, position) => {
  return axios.post("http://localhost:8000/api/tecnico", {
    numero_de_cedula: IdCard,
    nombre: name,
    apellido: lastName,
    correo_electronico: email,
    telefono: phone,
    contrasenia: password,
    especialidad: position
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const getClient = (id) => {
  return axios.get(`http://localhost:8000/api/cliente/${id}`)
};

const getTechnical = (id) => {
  return axios.get(`http://localhost:8000/api/tecnico/${id}`)
};

const updateClient = (id, IdCard, name, lastName, email, phone, address) => {
  return axios.put(`http://localhost:8000/api/cliente/${id}`, {
    numero_de_cedula: IdCard,
    nombre: name,
    apellido: lastName,
    correo_electronico: email,
    telefono: phone,
    direccion: address
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const getListTechnical = () => {
  return axios.get("http://localhost:8000/api/tecnico")
};



export const administratorService = {
  createTechnical,
  getListTechnical,
  getClient,
  getTechnical,
  updateClient,
}