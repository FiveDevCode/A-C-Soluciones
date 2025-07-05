import api from "../controllers/common/Api.controller";



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



export const technicalService = {
  getServiceAssign,
  getListVisits,
  getTechnicalId,
}