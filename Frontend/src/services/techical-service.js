


const getServiceAssign = (id) => {
  const token = localStorage.getItem("authToken");

  return axios.get(`http://localhost:8000/api/servicios/asignados/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}



export const technicalService = {
  getServiceAssign,
}