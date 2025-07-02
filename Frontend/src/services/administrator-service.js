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

const createService = (nameService, descripcion) => {
  const token = sessionStorage.getItem("authToken");

  return axios.post("http://localhost:8000/api/servicios", {
    nombre: nameService,
    descripcion: descripcion
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
};

const updateService = (id, nameService, descripcion) => {
  const token = sessionStorage.getItem("authToken");

  return axios.put(`http://localhost:8000/api/servicios/${id}`, {
    nombre: nameService,
    descripcion: descripcion
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
};

const getService = (id) => {
  const token = sessionStorage.getItem("authToken");


  return axios.get(`http://localhost:8000/api/servicios/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

}


const stateChange = (id, state) => {
  return axios.put(`http://localhost:8000/api/tecnico/${id}`, {
    estado: state
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const getListRequest = () => {
  const token = sessionStorage.getItem("authToken");

  return axios.get("http://localhost:8000/api/solicitudes", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const assignVisit = (estimatedDuration, previousNotes, postnotes, scheduledDate, requestId, technicalId, serviceId) => {
  const token = sessionStorage.getItem("authToken");

  return axios.post("http://localhost:8000/api/visitas", {
    duracion_estimada: estimatedDuration,
    notas_previas: previousNotes,
    fecha_programada: scheduledDate,
    notas_posteriores: postnotes,
    solicitud_id_fk: requestId,
    tecnico_id_fk: technicalId,
    servicio_id_fk: serviceId

  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
}

const getServiceList = () => {
  const token = sessionStorage.getItem("authToken");

  return axios.get("http://localhost:8000/api/servicios", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getAdminId = (id) => {
  return axios.get(`http://localhost:8000/api/admin/${id}`)
}

const updateAdmin = (id, idCard, nameUser, lastName, email) => {
  
  return axios.put(`http://localhost:8000/api/admin/${id}`, {
    numero_cedula: idCard,
    nombre: nameUser,
    apellido: lastName,
    correo_electronico: email,
  }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
}

const updateTechnical = (id, idCard, nameUser, lastName, email, phone, position) => {
  return axios.put(`http://localhost:8000/api/tecnico/${id}`, {
    numero_de_cedula: idCard,
    nombre: nameUser,
    apellido: lastName,
    telefono: phone, 
    correo_electronico: email,
    especialidad: position,

  }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
}

const getListVisit = () => {
  const token = sessionStorage.getItem("authToken");

  return axios.get(`http://localhost:8000/api/visitas`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getVisit =  (id_visit) => {
  const token = sessionStorage.getItem("authToken");

  return axios.get(`http://localhost:8000/api/visitas/${id_visit}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

}

const createAdmin = (idCard, name, lastName, email, password) => {
  const token = sessionStorage.getItem("authToken");

  return axios.post("http://localhost:8000/api/admin", {
    numero_cedula: idCard,
    nombre: name,
    apellido: lastName, 
    correo_electronico: email,
    contrasenia: password

  }, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

export const administratorService = {
  createTechnical,
  getListTechnical,
  getClient,
  getTechnical,
  getService,
  updateClient,
  createService,
  stateChange,
  getListRequest,
  assignVisit,
  updateService,
  getServiceList,
  getAdminId,
  updateAdmin,
  updateTechnical,
  getListVisit,
  getVisit,
  createAdmin
  
}