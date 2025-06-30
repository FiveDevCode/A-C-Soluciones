import axios from "axios";


const createTechnical = (IdCard, name, lastName, email, phone, password, position) => {
  return axios.post("http://localhost:7000/api/tecnico", {
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
  return axios.get(`http://localhost:7000/api/cliente/${id}`)
};

const getTechnical = (id) => {
  return axios.get(`http://localhost:7000/api/tecnico/${id}`)
};

const updateClient = (id, IdCard, name, lastName, email, phone, address) => {
  return axios.put(`http://localhost:7000/api/cliente/${id}`, {
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
  return axios.get("http://localhost:7000/api/tecnico")
};

const createService = (nameService, descripcion) => {
  const token = localStorage.getItem("authToken");

  return axios.post("http://localhost:7000/api/servicios", {
    nombre: nameService,
    descripcion: descripcion
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
};

const stateChange = (id, state) => {
  return axios.put(`http://localhost:7000/api/tecnico/${id}`, {
    estado: state
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const getListRequest = () => {
  const token = localStorage.getItem("authToken");

  return axios.get("http://localhost:7000/api/solicitudes", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const assignVisit = (estimatedDuration, previousNotes, postnotes, scheduledDate, requestId, technicalId ) => {
  const token = localStorage.getItem("authToken");

  return axios.post("http://localhost:7000/api/visitas", {
    duracion_estimada: estimatedDuration,
    notas_previas: previousNotes,
    fecha_programada: scheduledDate,
    notas_posteriores: postnotes,
    solicitud_id_fk: requestId,
    tecnico_id_fk: technicalId,


  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
}


export const administratorService = {
  createTechnical,
  getListTechnical,
  getClient,
  getTechnical,
  updateClient,
  createService,
  stateChange,
  getListRequest,
  assignVisit
}