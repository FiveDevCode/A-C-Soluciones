import axios from "axios";



const getServiceAssign = (id) => {
  const token = localStorage.getItem("authToken");

  return axios.get(`http://localhost:8000/api/visitas/asignados/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getListVisits = () => {
  const token = localStorage.getItem("authToken");

  return axios.get(`http://localhost:8000/api/visitas/asignados`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getTechnicalId = (id) => {
  return axios.get(`http://localhost:8000/api/tecnico/${id}`)
}



export const technicalService = {
  getServiceAssign,
  getListVisits,
  getTechnicalId,
}