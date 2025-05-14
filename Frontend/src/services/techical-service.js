import axios from "axios";



const getServiceAssign = (id) => {
  const token = sessionStorage.getItem("authToken");

  return axios.get(`http://localhost:8000/api/visitas/asignados/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getListVisits = () => {
  const token = sessionStorage.getItem("authToken");

  return axios.get(`http://localhost:8000/api/visitas/asignados`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}



export const technicalService = {
  getServiceAssign,
  getListVisits,
}