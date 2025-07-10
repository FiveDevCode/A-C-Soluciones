import api from "../controllers/common/api.controller";


const createTechnical = (IdCard, name, lastName, email, phone, password, position) => {
  return api.post("/tecnico", {
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
  return api.get(`/cliente/${id}`)
};

const getTechnical = (id) => {
  return api.get(`/tecnico/${id}`)
};

const updateClient = (id, IdCard, name, lastName, email, phone, address) => {
  return api.put(`/cliente/${id}`, {
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
  return api.get("/tecnico")
};

const createService = (nameService, descripcion) => {
  const token = localStorage.getItem("authToken");

  return api.post("/servicios", {
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
  const token = localStorage.getItem("authToken");

  return api.put(`/servicios/${id}`, {
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
  const token = localStorage.getItem("authToken");


  return api.get(`/servicios/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

}


const stateChange = (id, state) => {
  return api.put(`/tecnico/${id}`, {
    estado: state
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const UpdateStateClient = (id, state) => {
  return api.put(`/cliente/${id}`, {
    estado: state
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const UpdateStateService = (id, state) => {
  return api.put(`/servicios/${id}`, {
    estado: state
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const getListRequest = () => {
  const token = localStorage.getItem("authToken");

  return api.get("/solicitudes", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const assignVisit = (estimatedDuration, previousNotes, postnotes, scheduledDate, requestId, technicalId, serviceId) => {
  const token = localStorage.getItem("authToken");

  return api.post("/visitas", {
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
  const token = localStorage.getItem("authToken");

  return api.get("/servicios", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getAdminId = (id) => {
  return api.get(`/admin/${id}`)
}

const updateAdmin = (id, idCard, nameUser, lastName, email) => {
  
  return api.put(`/admin/${id}`, {
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
  return api.put(`/tecnico/${id}`, {
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
  const token = localStorage.getItem("authToken");

  return api.get(`/visitas`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getVisit =  (id_visit) => {
  const token = localStorage.getItem("authToken");

  return api.get(`/visitas/${id_visit}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

}

const createAdmin = (idCard, name, lastName, email, password) => {
  const token = localStorage.getItem("authToken");

  return api.post("/admin", {
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


const getListAdministrator = () => {
  return api.get("/admin")

}

const updateStateRequest = (id, state) => {
  return api.patch(`/solicitudes/${id}/estado`, 
    { estado: state }, // Aquí va el body
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};

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
  createAdmin,
  getListAdministrator,
  UpdateStateClient,
  UpdateStateService,
  updateStateRequest
  
}