import api from "../controllers/common/api.controller";



const getServiceAssign = (id) => {
  const token = localStorage.getItem("authToken");

  return api.get(`/visitas/asignados/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getListVisits = () => {
  const token = localStorage.getItem("authToken");

  return api.get(`/visitas/asignados`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getTechnicalId = (id) => {
  return api.get(`/tecnico/${id}`)
}

const updateProfileTechnical = (id, nameUser, lastName, phone, email) => {
  return api.put(`/tecnico/${id}`, {
    nombre: nameUser,
    apellido: lastName,
    telefono: phone,
    correo_electronico: email,
  }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
}

const getFichasPorTecnico = (id_tecnico) => {
  const token = localStorage.getItem("authToken");
  
  return api.get(`/obtener-por-tecnico/${id_tecnico}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

export const technicalService = {
  getServiceAssign,
  getListVisits,
  getTechnicalId,
  updateProfileTechnical,
  getFichasPorTecnico,
}